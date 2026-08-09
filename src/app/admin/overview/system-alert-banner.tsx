import React from "react";
import Link from "next/link";
import { AlertTriangle, PackageOpen, CheckCircle, ArrowRight } from "lucide-react";
import { getSystemAlertState } from "@/lib/admin-data";

export async function SystemAlertBanner() {
  const { pendingOrdersCount, lowStockCount } = await getSystemAlertState();

  if (pendingOrdersCount > 0) {
    return (
      <div className="bg-[#FFFAEB] border border-[#F59E0B]/30 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all hover:bg-[#FFF8E1]">
        <div className="flex items-center gap-3">
          <div className="bg-[#F59E0B]/10 p-2 text-[#F59E0B]">
            <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-widest font-bold text-[#92400E]">
              Action Required
            </h4>
            <p className="text-[11px] uppercase tracking-wider text-[#B45309] mt-0.5">
              You have <span className="font-bold">{pendingOrdersCount} pending {pendingOrdersCount === 1 ? 'order' : 'orders'}</span> awaiting processing.
            </p>
          </div>
        </div>
        <Link 
          href="/admin/orders?status=processing" 
          className="bg-[#F59E0B] text-white px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Review Orders <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (lowStockCount > 0) {
    return (
      <div className="bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all hover:bg-orange-100/50">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 text-orange-600">
            <PackageOpen className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-[12px] uppercase tracking-widest font-bold text-orange-800">
              Low Inventory Warning
            </h4>
            <p className="text-[11px] uppercase tracking-wider text-orange-700 mt-0.5">
              <span className="font-bold">{lowStockCount} {lowStockCount === 1 ? 'product is' : 'products are'}</span> currently out of stock or running low.
            </p>
          </div>
        </div>
        <Link 
          href="/admin/products?filter=low-stock" 
          className="bg-orange-600 text-white px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F3Fdf5] border border-[#5B7763]/20 flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-[#5B7763]/10 p-2 text-[#5B7763]">
          <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">
            System Optimal
          </h4>
          <p className="text-[11px] uppercase tracking-wider text-[#5B7763] mt-0.5 font-medium">
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
