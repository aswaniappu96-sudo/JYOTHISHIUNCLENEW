import type { CatalogCategory, Pooja, Product } from "@/types/wordpress";

export type FilterChip = {
  id: string;
  label: string;
  count: number;
};

const POOJA_GROUPS = [
  { id: "ganesha", label: "Ganesha", test: /ganapathi|ganesha|ganesh|vinayaka/i },
  { id: "shiva", label: "Shiva", test: /mrityunjaya|mrityunjay|shiva|aghora|rudra|bhairav/i },
  { id: "vishnu", label: "Vishnu", test: /sudarshan|vishnu|narayan/i },
  { id: "devi", label: "Devi", test: /devi|durga|kali|lalita|chandi|bagalamukhi|bhagalamukhi|amman/i },
  { id: "navagraha", label: "Navagraha", test: /navagraha|nava\s*graha/i },
] as const;

const PRODUCT_KINDS = [
  { id: "rudraksha", label: "Rudraksha", test: /rudraksha/i },
  { id: "yantra", label: "Yantra", test: /yantra/i },
  { id: "incense", label: "Incense", test: /incense|agarbatti|dhoop|sambrani/i },
  { id: "samagri", label: "Puja samagri", test: /ghee|chandan|sandal|kumkum|camphor|karpuram|samagri/i },
  { id: "gem", label: "Gem", test: /\bgem|navratna|\bratna|pukhraj|neelam/i },
  { id: "mala", label: "Mala", test: /\bmala|sphatik|tulsi|\bbead/i },
] as const;

const STOCK = [
  { id: "in_stock", label: "Available" },
  { id: "made_to_order", label: "Made to order" },
  { id: "unavailable", label: "Enquire" },
] as const;

export function plainText(value?: string) {
  return (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function matchesQuery(haystack: string, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle);
}

export function poojaHaystack(pooja: Pick<Pooja, "title" | "slug" | "short_description" | "benefits">) {
  return [pooja.title, pooja.slug, plainText(pooja.short_description), plainText(pooja.benefits)].filter(Boolean).join(" ");
}

function poojaGroupText(pooja: Pick<Pooja, "title" | "short_description" | "benefits">) {
  return [pooja.title, plainText(pooja.short_description), plainText(pooja.benefits)].filter(Boolean).join(" ");
}

export function productHaystack(product: Pick<Product, "title" | "slug" | "short_description" | "product_info">) {
  return [product.title, product.slug, plainText(product.short_description), plainText(product.product_info)]
    .filter(Boolean)
    .join(" ");
}

function subsetChips(allCount: number, groups: FilterChip[]) {
  const useful = groups.filter((chip) => chip.count > 0 && chip.count < allCount);
  if (!useful.length) return [];
  return [{ id: "all", label: "All", count: allCount }, ...useful];
}

function categoryCatalog(items: { categories?: CatalogCategory[] }[], catalog: CatalogCategory[]) {
  const bySlug = new Map<string, string>();
  for (const term of catalog) {
    if (term.slug && term.name) bySlug.set(term.slug, term.name);
  }
  for (const item of items) {
    for (const term of item.categories || []) {
      if (term.slug && term.name && !bySlug.has(term.slug)) bySlug.set(term.slug, term.name);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function usesCategories(items: { categories?: CatalogCategory[] }[], catalog: CatalogCategory[]) {
  return catalog.length > 0 || items.some((item) => Array.isArray(item.categories));
}

function categoryChips(items: { categories?: CatalogCategory[] }[], catalog: CatalogCategory[]): FilterChip[] {
  const terms = categoryCatalog(items, catalog);
  if (!terms.length) return [];
  return [
    { id: "all", label: "All", count: items.length },
    ...terms.map((term) => ({
      id: term.slug,
      label: term.name,
      count: items.filter((item) => (item.categories || []).some((row) => row.slug === term.slug)).length,
    })),
  ];
}

export function matchesCategory(categories: CatalogCategory[] | undefined, groupId: string) {
  if (groupId === "all") return true;
  return (categories || []).some((term) => term.slug === groupId);
}

export function poojaFilterChips(poojas: Pooja[], catalog: CatalogCategory[] = []): FilterChip[] {
  if (usesCategories(poojas, catalog)) return categoryChips(poojas, catalog);
  return subsetChips(
    poojas.length,
    POOJA_GROUPS.map((group) => ({
      id: group.id,
      label: group.label,
      count: poojas.filter((item) => group.test.test(poojaGroupText(item))).length,
    })),
  );
}

export function poojaMatchesGroup(pooja: Pooja, groupId: string) {
  if (groupId === "all") return true;
  if (Array.isArray(pooja.categories)) return matchesCategory(pooja.categories, groupId);
  const group = POOJA_GROUPS.find((item) => item.id === groupId);
  return group ? group.test.test(poojaGroupText(pooja)) : false;
}

export function productKindId(product: Pick<Product, "title" | "slug" | "short_description">) {
  const visible = `${product.title} ${plainText(product.short_description)}`;
  const fromVisible = PRODUCT_KINDS.find((kind) => kind.test.test(visible));
  if (fromVisible) return fromVisible.id;
  const fromSlug = PRODUCT_KINDS.find((kind) => kind.test.test(product.slug || ""));
  return fromSlug?.id ?? "other";
}

export function productKindChips(products: Product[], catalog: CatalogCategory[] = []): FilterChip[] {
  if (usesCategories(products, catalog)) return categoryChips(products, catalog);
  return subsetChips(
    products.length,
    PRODUCT_KINDS.map((kind) => ({
      id: kind.id,
      label: kind.label,
      count: products.filter((item) => productKindId(item) === kind.id).length,
    })),
  );
}

export function productMatchesKind(product: Product, kindId: string) {
  if (kindId === "all") return true;
  if (Array.isArray(product.categories)) return matchesCategory(product.categories, kindId);
  return productKindId(product) === kindId;
}

export function productStockChips(products: Product[]): FilterChip[] {
  return subsetChips(
    products.length,
    STOCK.map((stock) => ({
      id: stock.id,
      label: stock.label,
      count: products.filter((item) => (item.availability || "in_stock") === stock.id).length,
    })),
  );
}
