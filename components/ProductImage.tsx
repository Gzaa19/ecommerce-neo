"use client";
import Image from "next/image";
import { useState } from "react";
export default function ProductImage({src, alt, preload = false}: {src:string | null; alt:string; preload?:boolean}) {
  const [failed, setFailed] = useState(false);
  return <div className="product-image">{src && !failed ? <Image src={src} alt={alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" preload={preload} fetchPriority={preload ? "high" : undefined} onError={() => setFailed(true)} /> : <span role="img" aria-label={alt}>Foto belum tersedia</span>}</div>;
}
