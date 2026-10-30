import type { Pooja, Product } from "@/types/wordpress";

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

export function poojaFilterChips(poojas: Pooja[]): FilterChip[] {
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
  const group = POOJA_GROUPS.find((item) => item.id === groupId);
  return group ? group.test.test(poojaGroupText(pooja)) : true;
}

export function productKindId(product: Pick<Product, "title" | "slug" | "short_description">) {
  const visible = `${product.title} ${plainText(product.short_description)}`;
  const fromVisible = PRODUCT_KINDS.find((kind) => kind.test.test(visible));
  if (fromVisible) return fromVisible.id;
  const fromSlug = PRODUCT_KINDS.find((kind) => kind.test.test(product.slug || ""));
  return fromSlug?.id ?? "other";
}

export function productKindChips(products: Product[]): FilterChip[] {
  return subsetChips(
    products.length,
    PRODUCT_KINDS.map((kind) => ({
      id: kind.id,
      label: kind.label,
      count: products.filter((item) => productKindId(item) === kind.id).length,
    })),
  );
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
