import type { Store, Category, Product } from "./store.ts";
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
function requireField(valid: boolean, field: string): void { if (!valid) throw new Error(`Data katalog invalid: ${field}`); }
export function validateCatalog(store: Store, categories: Category[], products: Product[]): void {
  for (const field of ["name", "logo", "description"] as const) requireField(nonempty(store[field]), `store.${field}`);
  requireField(store.name === "WattUp!", "store.name");
  requireField(store.logo === "/brand/wattup-logo.png", "store.logo");
  requireField(typeof store.whatsapp === "string", "store.whatsapp");
  requireField(typeof store.isDemo === "boolean", "store.isDemo");
  for (const field of ["address", "openingHours"] as const) requireField(store[field] === null || nonempty(store[field]), `store.${field}`);
  const ids = new Set<string>(), names = new Set<string>(), codes = new Set<string>();
  for (const category of categories) {
    requireField(nonempty(category.id) && category.id !== "all" && !ids.has(category.id), "category.id");
    requireField(nonempty(category.name) && !names.has(category.name), "category.name");
    ids.add(category.id); names.add(category.name);
  }
  for (const product of products) {
    const key = `product[${product.code || "unknown"}]`;
    requireField(nonempty(product.code) && !codes.has(product.code), `${key}.code`); codes.add(product.code);
    for (const field of ["name", "description", "imageAlt"] as const) requireField(nonempty(product[field]), `${key}.${field}`);
    requireField(ids.has(product.categoryId), `${key}.categoryId`);
    requireField(Number.isSafeInteger(product.price) && product.price > 0, `${key}.price`);
    requireField(product.image === null || (typeof product.image === "string" && /^\/products\/[a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg)$/.test(product.image)), `${key}.image`);
    requireField(Array.isArray(product.specs) && product.specs.length >= 3 && product.specs.length <= 5 && product.specs.every(s => s && nonempty(s.label) && nonempty(s.value)), `${key}.specs`);
    requireField(product.availability === "available" || product.availability === "sold_out", `${key}.availability`);
  }
}
export function filterProducts(products: Product[], query: string, categoryId: string): Product[] {
  const normalized = query.trim().toLocaleLowerCase("id-ID");
  return products.filter(p => (categoryId === "all" || p.categoryId === categoryId) && p.name.toLocaleLowerCase("id-ID").includes(normalized));
}
const rupiah = new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0});
export const formatPrice = (price: number): string => rupiah.format(price);
function whatsappUrl(store: Store, message: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(store.whatsapp)) return null;
  const url = new URL(`https://wa.me/${store.whatsapp}`); url.searchParams.set("text", message); return url.href;
}
export function buildPurchaseUrl(store: Store, product: Product): string | null {
  if (product.availability !== "available") return null;
  return whatsappUrl(store, purchaseMessage(store, product));
}
export function purchaseMessage(store: Store, product: Product): string {
  return `Halo ${store.name}, saya ingin memesan:
Produk: ${product.name}
Kode: ${product.code}
Jumlah: 1
Harga katalog: ${formatPrice(product.price)}
Mohon konfirmasi ketersediaan, harga akhir, dan ongkir. Terima kasih.`;
}
export function buildContactUrl(store: Store): string | null {
  return whatsappUrl(store, `Halo ${store.name}, saya ingin bertanya tentang produk elektronik yang tersedia.`);
}
