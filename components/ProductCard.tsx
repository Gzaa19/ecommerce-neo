import Link from "next/link";
import type { Store, Category, Product } from "../lib/store.ts";
import { formatPrice } from "../lib/catalog.ts";
import ProductImage from "./ProductImage";
import PurchaseAction from "./PurchaseAction";
export default function ProductCard({product,store,category}: {product:Product;store:Store;category?:Category}) {
 return <article className="product-card" aria-labelledby={`name-${product.code}`}><div className="card-photo"><ProductImage src={product.image} alt={product.imageAlt}/><span className={`stock ${product.availability==="sold_out"?"sold-out":""}`}>{product.availability==="available"?"Tersedia":"Habis"}{store.isDemo?" · DEMO":""}</span><span className="photo-code">{product.code}</span></div><div className="card-body"><p className="card-category">{category?.name}</p><div className="spec-chips">{product.specs.slice(0,2).map(s=><span key={s.label}>{s.value}</span>)}</div><h3 id={`name-${product.code}`}>{product.name}</h3><p className="card-description">{product.description}</p><div className="card-bottom"><span className="price-label">{store.isDemo?"HARGA CONTOH":"HARGA KATALOG"}</span><p className="price">{formatPrice(product.price)}</p><Link className="button detail-link" href={`/produk/${encodeURIComponent(product.code)}/`}>Detail Produk</Link><PurchaseAction store={store} product={product}/></div></div></article>;
}
