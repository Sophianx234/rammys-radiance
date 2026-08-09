

import Sidebar from "@/components/ui/side-bar";
import Topbar from "@/components/ui/topbar";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode, useState } from "react";
import '../globals.css';
import ScrollToTop from "@/components/scroll-to-top";
import { ConfirmProvider } from "@/components/ui/confirm-provider";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function AdminPage({ children }: { children: ReactNode}) {
 
  return (
       <html lang="en">

      <body className={`font-sans    antialiased`}>
        <ConfirmProvider>
          <ScrollToTop />
          <div className="flex bg-[#F3F4F6] min-h-screen">
            <Sidebar  />
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="p-2 sm:p-8">
               {children}
              </main>
            </div>
          </div>
        </ConfirmProvider>
      </body>
       </html>
  );
}
