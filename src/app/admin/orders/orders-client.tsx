"use client";
import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  ExternalLink,
  XCircle,
  CreditCard,
  X,
  Check,
  SlidersHorizontal,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import StatusSelector from "./status-selector";
import PaymentBadge from "./payment-badge";
import OrderDetailsSheetContent from "./order-details";
import { useDashStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { updateOrderStatusAction, deleteOrderAction, batchUpdateOrderStatusAction } from "@/app/actions/orders";
import { useConfirm } from "@/components/ui/confirm-provider";

export type OrderStatus =
  | "processing"
  | "awaiting_payment"
  | "paid"
  | "awaiting_pickup"
  | "packed"
  | "ready_for_dispatch"
  | "dispatched"
  | "in_transit"
  | "arrived"
  | "delivery_attempted"
  | "delivered"
  | "cancelled"
  | "failed";

import { STATUS_CONFIG, formatCurrency, formatDate } from "./utils";

export function OrdersClient({ initialOrders, pagination }: { initialOrders: any[], pagination: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirm();
  
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") ? searchParams.get("status")!.split(',') : [];
  const dateFilter = searchParams.get("dateFilter") || "all";
  const page = parseInt(searchParams.get("page") || "1");

  const {user} = useDashStore();
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [batchActionLoading, setBatchActionLoading] = useState(false);

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.success) {
      toast.success("ORDER STATUS UPDATED");
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } else {
      toast.error("UPDATE FAILED");
    }
  };

  const handleDelete = async (orderId: string) => {
    setIsSheetOpen(false);
    const isConfirmed = await confirm({
      title: "Delete Order?",
      description: "This action cannot be undone.",
      confirmText: "Yes, Delete It",
      variant: "destructive"
    });

    if (isConfirmed) {
      const res = await deleteOrderAction(orderId);
      if (res.success) {
        toast.success("ORDER DELETED");
        if (selectedOrder?._id === orderId) {
          setIsSheetOpen(false);
          setSelectedOrder(null);
        }
      } else {
        toast.error("DELETE FAILED");
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(initialOrders.map((o) => o.paymentReference)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (paymentReference: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(paymentReference)) next.delete(paymentReference);
      else next.add(paymentReference);
      return next;
    });
  };

  const handleBatchStatusUpdate = async (newStatus: string) => {
    if (!newStatus) return;
    setBatchActionLoading(true);
    const res = await batchUpdateOrderStatusAction(Array.from(selectedOrders), newStatus);
    if (res.success) {
      toast.success("BATCH STATUS UPDATED");
      setSelectedOrders(new Set());
    } else {
      toast.error("BATCH UPDATE FAILED");
    }
    setBatchActionLoading(false);
  };

  const isFilterActive = statusFilter.length > 0 || dateFilter !== "all" || searchTerm !== "";
  
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("status");
    params.delete("dateFilter");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleStatusFilter = (statusKey: string) => {
    let newFilter;
    if (statusFilter.includes(statusKey)) {
      newFilter = statusFilter.filter(s => s !== statusKey);
    } else {
      newFilter = [...statusFilter, statusKey];
    }
    updateURL({ status: newFilter.length > 0 ? newFilter.join(",") : null, page: "1" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-8 pb-20"
    >
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Orders Management</h2>
          <p className="text-[12px] text-text-muted mt-1 tracking-wider font-medium">
            Track and process all customer orders
          </p>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white border border-border/40 p-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-[#5B7763] transition-colors" />
          <Input
            placeholder="SEARCH ORDER #, PHONE OR NAME..."
            className="pl-11 pr-10 bg-secondary/20 border-border/40 text-[11px] uppercase tracking-wider h-12 rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763]"
            value={searchTerm}
            onChange={(e) => updateURL({ search: e.target.value, page: "1" })}
          />
          {searchTerm && (
            <button 
              onClick={() => updateURL({ search: null, page: "1" })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#222222]"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`h-12 px-4 border border-border/40 flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold transition-colors ${statusFilter.length > 0 ? "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20" : "bg-white text-text-muted hover:text-[#222222] hover:bg-secondary/50"}`}
              >
                <Filter className="w-3.5 h-3.5" />
                STATUS
                {statusFilter.length > 0 && (
                  <>
                    <span className="w-px h-4 bg-border/40 mx-1" />
                    <span>{statusFilter.length} SELECTED</span>
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-none border-border/40 shadow-sm p-2">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-text-muted font-bold px-2 py-2">Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />
              {Object.keys(STATUS_CONFIG).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={statusFilter.includes(key)}
                  onCheckedChange={() => toggleStatusFilter(key)}
                  className="text-[12px] rounded-none focus:bg-secondary/50 focus:text-[#222222] py-2 cursor-pointer"
                >
                  {STATUS_CONFIG[key].label}
                </DropdownMenuCheckboxItem>
              ))}
              {statusFilter.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem 
                    onSelect={() => updateURL({ status: null, page: "1" })}
                    className="justify-center text-center text-[10px] uppercase tracking-wider font-bold text-[#222222] hover:bg-secondary/50 rounded-none cursor-pointer py-2"
                  >
                    CLEAR STATUS
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={dateFilter} onValueChange={(val) => updateURL({ dateFilter: val, page: "1" })}>
            <SelectTrigger className={`h-12 w-[180px] rounded-none text-[11px] uppercase tracking-wider font-bold focus:ring-0 ${dateFilter !== 'all' ? "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20" : "bg-white text-text-muted border-border/40"}`}>
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <SelectValue placeholder="DATE RANGE" />
               </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/40">
               <SelectItem value="all" className="text-[11px] uppercase tracking-wider cursor-pointer">All Time</SelectItem>
               <SelectItem value="today" className="text-[11px] uppercase tracking-wider cursor-pointer">Today</SelectItem>
               <SelectItem value="week" className="text-[11px] uppercase tracking-wider cursor-pointer">Last 7 Days</SelectItem>
               <SelectItem value="month" className="text-[11px] uppercase tracking-wider cursor-pointer">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          {isFilterActive && (
            <button 
              onClick={clearFilters}
              className="h-12 px-3 text-text-muted hover:text-red-600 transition-colors flex items-center justify-center"
              title="Reset Filters"
            >
              <XCircle className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white border border-border/40">
        {selectedOrders.size > 0 && (
          <div className="bg-secondary/20 border-b border-border/40 px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#222222]">
                {selectedOrders.size} Order{selectedOrders.size > 1 ? 's' : ''} Selected
              </span>
              <span className="w-px h-4 bg-border/40" />
              {(user?.role === "admin" || user?.role === "manager") && (
                <Select onValueChange={handleBatchStatusUpdate} disabled={batchActionLoading}>
                  <SelectTrigger className="h-8 border-border/40 bg-white text-[11px] uppercase tracking-wider font-bold w-48 focus:ring-0">
                    <SelectValue placeholder="UPDATE STATUS" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border/40">
                    {Object.keys(STATUS_CONFIG).map((key) => (
                      <SelectItem key={key} value={key} className="text-[11px] uppercase tracking-wider font-bold">{STATUS_CONFIG[key].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <button onClick={() => setSelectedOrders(new Set())} className="text-[11px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222]">
              CANCEL
            </button>
          </div>
        )}

        {initialOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-border/60 mx-auto mb-4" />
            <h3 className="text-[14px] font-bold text-[#222222] uppercase tracking-widest mb-1">No Orders Found</h3>
            <p className="text-[12px] text-text-muted">Try adjusting your filters or search term.</p>
            {isFilterActive && (
              <button 
                onClick={clearFilters}
                className="mt-6 border border-border/40 bg-white text-[#222222] px-6 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary/50 transition-colors inline-block"
              >
                CLEAR ALL FILTERS
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-secondary/10">
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted w-10">
                    <input 
                      type="checkbox" 
                      className="rounded-none border-border/40 text-[#5B7763] focus:ring-[#5B7763]"
                      checked={initialOrders.length > 0 && selectedOrders.size === initialOrders.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted">Order ID & Date</th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted">Customer</th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted">Total</th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted">Status</th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted">Payment</th>
                  <th className="py-4 px-4 font-bold text-[10px] uppercase tracking-widest text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((order) => {
                  const StatusIcon = STATUS_CONFIG[order.orderStatus]?.icon || AlertCircle;
                  return (
                    <tr 
                      key={order._id} 
                      className={`border-b border-border/40 hover:bg-secondary/10 transition-colors group cursor-pointer ${selectedOrders.has(order.paymentReference) ? 'bg-secondary/20' : ''}`}
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsSheetOpen(true);
                      }}
                    >
                      <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="rounded-none border-border/40 text-[#5B7763] focus:ring-[#5B7763]"
                          checked={selectedOrders.has(order.paymentReference)}
                          onChange={() => handleSelectOrder(order.paymentReference)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[13px] text-[#222222] uppercase">
                              #{order._id.substring(order._id.length - 6)}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(order._id);
                                toast.success('ID COPIED');
                              }}
                              className="text-text-muted hover:text-[#222222] transition-colors opacity-0 group-hover:opacity-100"
                              title="Copy full ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-text-muted mt-1 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[13px] text-[#222222]">{order.user?.name || "Guest User"}</span>
                          <span className="text-[11px] text-text-muted mt-0.5">{order.user?.email || order.customer?.phone || "No contact info"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[13px] text-[#222222]">{formatCurrency(order.totalAmount)}</span>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{order.items?.length || 0} ITEMS</div>
                      </td>
                      <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                        {(user?.role === "admin" || user?.role === "manager") ? (
                          <StatusSelector 
                            currentStatus={order.orderStatus} 
                            paymentReference={order.paymentReference} 
                            onUpdate={handleStatusUpdate} 
                          />
                        ) : (
                          <span className={`inline-flex items-center justify-center px-2 py-1 text-[9px] uppercase tracking-widest font-bold border ${STATUS_CONFIG[order.orderStatus]?.color || ''}`}>
                            {STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <PaymentBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-secondary/50 transition-colors text-text-muted hover:text-[#222222]">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-none border-border/40 shadow-sm p-1">
                            <DropdownMenuItem 
                              className="text-[11px] uppercase tracking-wider font-bold text-[#222222] rounded-none focus:bg-secondary/50 cursor-pointer"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsSheetOpen(true);
                              }}
                            >
                              <ExternalLink className="mr-2 h-3.5 w-3.5" /> View Details
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-border/40 my-1" />
                            {user?.role === 'admin' && (
                              <DropdownMenuItem 
                                className="text-[11px] uppercase tracking-wider font-bold text-red-600 rounded-none focus:bg-red-50 focus:text-red-700 cursor-pointer"
                                onClick={() => handleDelete(order._id)}
                              >
                                <XCircle className="mr-2 h-3.5 w-3.5" /> Delete Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-border/40 p-4 flex items-center justify-between bg-secondary/10">
            <span className="text-[11px] uppercase tracking-wider font-bold text-text-muted">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => updateURL({ page: (page - 1).toString() })}
                className="w-8 h-8 flex items-center justify-center border border-border/40 bg-white text-[#222222] hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  if (
                    p === 1 || 
                    p === pagination.totalPages || 
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => updateURL({ page: p.toString() })}
                        className={`w-8 h-8 flex items-center justify-center border text-[11px] font-bold transition-colors ${
                          page === p 
                            ? "bg-[#222222] border-[#222222] text-white" 
                            : "bg-white border-border/40 text-[#222222] hover:bg-secondary/50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  } else if (
                    p === page - 2 || 
                    p === page + 2
                  ) {
                    return <span key={p} className="w-8 h-8 flex items-center justify-center text-text-muted">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => updateURL({ page: (page + 1).toString() })}
                className="w-8 h-8 flex items-center justify-center border border-border/40 bg-white text-[#222222] hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent showCloseButton={false} className="max-w-4xl p-0 gap-0 bg-white border border-border/40 rounded-none shadow-2xl h-[90vh] md:h-[85vh] overflow-hidden flex flex-col my-4 mx-4 md:mx-auto">
          {selectedOrder && (
            <OrderDetailsSheetContent 
              order={selectedOrder} 
              onClose={() => setIsSheetOpen(false)}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
