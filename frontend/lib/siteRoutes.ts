export const POOJAS_PATH = "/services?tab=poojas";
export const PRODUCTS_PATH = "/services?tab=products";

export function servicesTab(value?: string | null): "poojas" | "products" {
  return value === "products" ? "products" : "poojas";
}

export function isPoojasNav(pathname: string, tab?: string | null) {
  if (pathname.startsWith("/pooja")) return true;
  if (pathname === "/services") return servicesTab(tab) === "poojas";
  return false;
}

export function isProductsNav(pathname: string, tab?: string | null) {
  if (pathname.startsWith("/product")) return true;
  if (pathname === "/services") return servicesTab(tab) === "products";
  return false;
}
