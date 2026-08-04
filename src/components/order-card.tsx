import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderCardProps {
  order: any;
}

export default function OrderCard({ order }: OrderCardProps) {
  // Calculate delivery date (Next Friday)
  const getDeliveryMessage = (dateStr: string, status: string) => {
    if (status === "delivered") return "Delivered";
    if (status === "cancelled") return "Cancelled";

    const date = new Date(dateStr);
    const day = date.getDay();
    // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
    const daysUntilFriday = (5 - day + 7) % 7;
    // If today is Friday, let's schedule for next Friday.
    const addDays = daysUntilFriday === 0 ? 7 : daysUntilFriday;
    
    date.setDate(date.getDate() + addDays);
    const deliveryDateStr = date.toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'short' });
    
    return `Available for pickup on ${deliveryDateStr}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Processing</span>;
      case "in_transit":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">In Transit</span>;
      case "arrived":
        return <span className="bg-[#5B7763]/10 text-[#5B7763] border border-[#5B7763]/20 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Arrived</span>;
      case "delivered":
        return <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Delivered</span>;
      case "cancelled":
        return <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">Cancelled</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <Package className="w-4 h-4 text-yellow-600" />;
      case "in_transit": return <Truck className="w-4 h-4 text-blue-600" />;
      case "arrived": return <CheckCircle className="w-4 h-4 text-[#5B7763]" />;
      case "delivered": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4 text-text-muted" />;
    }
  };

  const firstItem = order.items?.[0];
  const extraItemsCount = order.items?.length > 1 ? order.items.length - 1 : 0;
  
  const isDeliveredOrCancelled = order.orderStatus === "delivered" || order.orderStatus === "cancelled";

  return (
    <div className="bg-white border border-border/40 rounded-none shadow-sm hover:border-[#5B7763]/50 transition-colors mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-4 md:px-6 border-b border-border/40 bg-secondary/10">
        <div>
          <p className="text-[12px] uppercase tracking-wider font-bold text-[#222222]">Order {order.paymentReference}</p>
          <p className="text-[11px] text-text-muted mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center gap-4">
          <p className="text-[13px] font-bold text-[#5B7763]">Total: ₵{(order.totalAmount / 100).toFixed(2)}</p>
          <Link href={`/track/${order._id}`} className="text-[11px] uppercase tracking-widest font-bold text-[#222222] hover:text-[#5B7763] transition-colors underline underline-offset-4">
            Track Order
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 flex-1">
            <div className="w-20 h-20 bg-secondary/20 flex-shrink-0 relative overflow-hidden border border-border/40">
              {firstItem?.product?.images?.[0] ? (
                <Image src={firstItem.product.images[0]} alt={firstItem.product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">No Image</div>
              )}
            </div>
            <div className="flex flex-col justify-center min-h-[5rem]">
              <p className="text-[13px] font-bold text-[#222222] line-clamp-2 leading-snug">{firstItem?.product?.name || "Product Name"}</p>
              <p className="text-[12px] text-text-muted mt-1">Qty: {firstItem?.quantity}</p>
              {extraItemsCount > 0 && (
                <p className="text-[11px] uppercase tracking-widest font-bold text-[#5B7763] mt-2">
                  + {extraItemsCount} more item{extraItemsCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center min-h-[5rem]">
            <div className="mb-3">
              {getStatusBadge(order.orderStatus)}
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {getStatusIcon(order.orderStatus)}
              </div>
              <p className={`text-[12px] font-medium leading-snug ${isDeliveredOrCancelled ? "text-text-muted" : "text-[#222222]"}`}>
                {getDeliveryMessage(order.createdAt, order.orderStatus)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
