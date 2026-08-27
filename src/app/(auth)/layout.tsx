export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import "../globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
 
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
          {children}
      </body>
    </html>
  )
}
