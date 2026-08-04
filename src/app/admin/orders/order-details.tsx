import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatCurrency, formatDate, OrderItem, ProductSummary, ServerOrder, STATUS_CONFIG } from "./page";
import { ExternalLink, MapPin, Package, User, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function OrderDetailsSheetContent({
  order,
  onDelete,
  onStatusChange,
  onClose,
}: {
  order: ServerOrder;
  onDelete: (id: string) => void;
  onStatusChange: (ref: string, newStatus: string) => void;
  onClose: () => void;
  userRole?: string;
}) {
  const Toast = withReactContent(Swal).mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    customClass: {
      popup: "rounded-none border border-border/40 bg-white",
      title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
    },
  });

  const normalizeItem = (it: OrderItem) => {
    const prod = typeof it.product === "string" ? { _id: it.product, name: "Product", image: null, price: it.price || 0 } : (it.product as ProductSummary);
    return {
      name: prod?.name || "Product",
      image: prod?.images[0] || null,
      price: it.price ?? prod?.price ?? 0,
      qty: it.quantity ?? 1,
      id: prod?._id,
    };
  };

  const items = (order.items || []).map(normalizeItem);

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      {/* HEADER */}
      <div className="px-8 py-8 bg-white border-b border-border/40 relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center border border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start pt-6">
            <div>
              <h2 className="text-[20px] uppercase tracking-widest font-bold text-[#222222]">Order Details</h2>
              <div className="text-[12px] text-text-muted mt-1 tracking-wider font-medium font-mono">
                #{order.paymentReference}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-[11px] uppercase tracking-wider font-bold text-text-muted">Status:</div>
             {userRole === "dispatch" || userRole === "dispatcher" ? (
               <div className="h-9 w-56 px-3 flex items-center border border-border/40 text-[11px] uppercase tracking-wider font-bold bg-secondary/10">
                 {STATUS_CONFIG[order.orderStatus]?.label ?? order.orderStatus}
               </div>
             ) : (
               <Select value={order.orderStatus} onValueChange={(v) => onStatusChange(order.paymentReference, v)} >
                  <SelectTrigger className="h-9 w-56 text-[11px] uppercase tracking-wider font-bold border-border/40 rounded-none focus:ring-0 bg-white shadow-none">
                    <SelectValue>{STATUS_CONFIG[order.orderStatus]?.label ?? order.orderStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border/40 shadow-sm">
                    {Object.entries(STATUS_CONFIG).map(([k, c]) => (
                      <SelectItem key={k} value={k} className="text-[11px] uppercase tracking-wider cursor-pointer rounded-none focus:bg-secondary/50">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
               </Select>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* ITEMS */}
        <section>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#222222] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} />
            Order Items
          </h3>

          <div className="border border-border/40 bg-white">
            <div className="divide-y divide-border/40">
              {items.map((it, idx) => (
                <div key={idx} className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 border border-border/40 bg-secondary/20 flex-shrink-0">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-widest text-text-muted font-bold">
                        No Img
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-[#222222]">{it.name}</p>
                      <p className="text-[11px] text-text-muted tracking-wider mt-1">QTY: {it.qty}</p>
                    </div>
                    <div className="text-[13px] font-bold text-[#222222]">{formatCurrency(it.price * it.qty)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-secondary/10 border-t border-border/40 flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest font-bold text-text-muted">Total Amount</span>
              <span className="text-[16px] font-bold text-[#5B7763]">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        {/* CUSTOMER & DELIVERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#222222] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} />
              Customer Info
            </h3>
            <div className="border border-border/40 bg-white p-5 space-y-4">
               <div className="flex items-center gap-3">
                  <img
                    src={order.user?.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.name || "Guest")}`}
                    alt={order.user?.name || "Guest"}
                    className="w-10 h-10 object-cover border border-border/40"
                  />
                  <div>
                    <div className="text-[13px] font-bold text-[#222222]">{order.user?.name ?? "Guest"}</div>
                    <div className="text-[11px] text-text-muted tracking-wider">{order.customer.phone}</div>
                  </div>
               </div>
               {order.user?.email && (
                 <div className="pt-4 border-t border-border/40">
                   <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Email Address</div>
                   <div className="text-[12px] text-[#222222] mt-1">{order.user.email}</div>
                 </div>
               )}
            </div>
          </section>

          <section>
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#222222] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} />
              Delivery Address
            </h3>
            <div className="border border-border/40 bg-white p-5 space-y-4">
              <div>
                <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Street Address</div>
                <div className="text-[12px] text-[#222222] mt-1 font-medium">{order.deliveryAddress.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted">City</div>
                  <div className="text-[12px] text-[#222222] mt-1 font-medium">{order.deliveryAddress.city}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Region</div>
                  <div className="text-[12px] text-[#222222] mt-1 font-medium">{order.deliveryAddress.region}</div>
                </div>
              </div>

              {order.deliveryAddress.lat && order.deliveryAddress.lng && (
                <div className="pt-4 border-t border-border/40">
                  <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted mb-2">Location Map</div>
                  <div className="w-full h-32 bg-secondary/20 border border-border/40 overflow-hidden relative">
                    <img
                      src={`https://api.maptiler.com/maps/streets-v2/static/${order.deliveryAddress.lng},${order.deliveryAddress.lat},15/600x300.png?markers=${order.deliveryAddress.lng},${order.deliveryAddress.lat}&key=${process.env.NEXT_PUBLIC_MAPTILER_PUBLIC_KEY}`}
                      alt="Delivery Location"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="px-8 py-4 bg-white border-t border-border/40 flex flex-wrap items-center justify-between gap-4 mt-auto">
        <div className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
          Created: {formatDate(order.createdAt)}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => Toast.fire({ icon: "success", title: "INVOICE DOWNLOADED (PLACEHOLDER)" })}
            className="border border-border/40 bg-white text-[#222222] px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Download Invoice
          </button>
          {userRole === "admin" && (
            <button 
              onClick={() => onDelete(order._id as string)}
              className="border border-red-200 bg-red-50 text-red-600 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold hover:bg-red-100 transition-colors"
            >
              Delete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}