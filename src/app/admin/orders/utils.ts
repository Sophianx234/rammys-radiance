import { Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  processing: { label: "Processing", color: "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20", icon: Clock },
  in_transit: { label: "In Transit", color: "bg-secondary/50 text-[#222222] border-border/40", icon: Truck },
  arrived: { label: "Arrived", color: "bg-secondary/50 text-[#222222] border-border/40", icon: Truck },
  delivered: { label: "Delivered", color: "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);

export const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
