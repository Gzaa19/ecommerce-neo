import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WattUp! | Toko Elektronik", description: "Katalog WattUp!: peralatan rumah, audio, dan aksesori elektronik. Temukan produk dan tanyakan pembelian melalui WhatsApp." };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="id"><body>{children}</body></html>; }
