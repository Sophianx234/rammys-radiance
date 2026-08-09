import React from "react";
import Link from "next/link";
import { AlertTriangle, PackageOpen, CheckCircle, ArrowRight } from "lucide-react";
import { getSystemAlertState } from "@/lib/admin-data";

export async function SystemAlertBanner() {
  const { pendingOrdersCount, lowStockCount } = await getSystemAlertState();

  if (pendingOrdersCount > 0) {
    return (
      <div className="bg-white border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all hover:border-[#222222]/20">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/30 p-2 text-[#222222]">
            <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">
              Action Required
            </h4>
            <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">
              You have <span className="font-bold text-[#222222]">{pendingOrdersCount} pending {pendingOrdersCount === 1 ? 'order' : 'orders'}</span> awaiting processing.
            </p>
          </div>
        </div>
        <Link 
          href="/admin/orders?status=processing" 
          className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Review Orders <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (lowStockCount > 0) {
    return (
      <div className="bg-white border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all hover:border-[#222222]/20">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/30 p-2 text-[#222222]">
            <PackageOpen className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">
              Inventory Alert
            </h4>
            <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">
              <span className="font-bold text-[#222222]">{lowStockCount} {lowStockCount === 1 ? 'product is' : 'products are'}</span> currently out of stock or running low.
            </p>
          </div>
        </div>
        <Link 
          href="/admin/products?filter=low-stock" 
          className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all hover:border-[#222222]/20">
      <div className="flex items-center gap-3">
        <div className="bg-secondary/30 p-2 text-[#5B7763]">
          <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">
            System Optimal
          </h4>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">
            System is running smoothly. No immediate actions required.
          </p>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-text-muted px-2">
        All Clear
      </div>
    </div>
  );
}
