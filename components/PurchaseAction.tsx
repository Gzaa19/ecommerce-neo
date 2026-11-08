import type { Product, Store } from "../lib/store.ts";
import { buildPurchaseUrl, buildContactUrl } from "../lib/catalog.ts";
export default function PurchaseAction({store,product,label,className=""}: {store:Store;product?:Product;label?:string;className?:string}) {
 const url=product?buildPurchaseUrl(store,product):buildContactUrl(store);
 const text=label??(product?"Beli via WhatsApp":"Chat Toko");
 const reason=product?.availability==="sold_out"?"Barang sedang habis":"Kontak toko belum tersedia";
 return <div className={`purchase-action ${className}`}>{url?<a className="button whatsapp" href={url}>{text}</a>:<><button className="button whatsapp" disabled>{text}</button><p className="disabled-reason">{reason}</p></>}</div>;
}
