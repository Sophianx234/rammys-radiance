"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  RefreshCw,
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
import { GridLoader } from "react-spinners";
import { useDashStore } from "@/lib/store";

/* ============================
   Types & Config
   ============================ */

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

export type PaymentStatus = "pending" | "paid" | "failed";

export type ServerOrder = {
  _id: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    profile?: string;
  } | null;
  customer: {
    phone: string;
  };
  deliveryAddress: {
    address: string;
    city: string;
    region: string;
    lat?: number;
    lng?: number;
  };
  items: any[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export const ITEMS_PER_PAGE = 10;

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

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);

export const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

/* ============================
   Main Component
   ============================ */

export default function OrdersManagement() {
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- Filtering States ---
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all"); // all, today, week, month
  const {user} = useDashStore();
  
  const [page, setPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<ServerOrder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.orders)) {
        throw new Error("Unexpected response");
      }
      setOrders(data.orders as ServerOrder[]);
    } catch (err) {
      console.error("Fetch orders error:", err);
      Toast.fire({ icon: "error", title: "Could not load orders." });
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (paymentReference: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentReference, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) => prev.map((o) => (o.paymentReference === paymentReference ? { ...o, orderStatus: newStatus as OrderStatus } : o)));
      Toast.fire({ icon: "success", title: "ORDER STATUS UPDATED" });
      if (selectedOrder && selectedOrder.paymentReference === paymentReference) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as OrderStatus });
      }
    } catch (err) {
      Toast.fire({ icon: "error", title: "UPDATE FAILED" });
    }
  };

  const handleDelete = async (orderId: string) => {
    setIsSheetOpen(false);
    const result = await Swal.fire({
      title: "ARE YOU SURE?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "YES, DELETE IT",
      cancelButtonText: "CANCEL",
      customClass: { 
        popup: "rounded-none border border-border/40 bg-white",
        title: "text-[14px] uppercase tracking-widest font-bold text-[#222222]",
        confirmButton: "rounded-none text-[11px] uppercase tracking-wider font-bold",
        cancelButton: "rounded-none text-[11px] uppercase tracking-wider font-bold"
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        Toast.fire({ icon: "success", title: "ORDER DELETED" });
        setIsSheetOpen(false);
      } catch (err) {
        Toast.fire({ icon: "error", title: "DELETE FAILED" });
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(paginated.map((o) => o.paymentReference)));
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
    try {
      const promises = Array.from(selectedOrders).map(ref => 
        fetch("/api/orders/update-status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: ref, status: newStatus }),
        })
      );
      
      const results = await Promise.all(promises);
      if (!results.every(res => res.ok)) throw new Error("Some updates failed");
      
      setOrders(prev => prev.map(o => 
        selectedOrders.has(o.paymentReference) ? { ...o, orderStatus: newStatus as OrderStatus } : o
      ));
      
      Toast.fire({ icon: "success", title: "BATCH STATUS UPDATED" });
      setSelectedOrders(new Set());
    } catch (err) {
      Toast.fire({ icon: "error", title: "BATCH UPDATE FAILED" });
    } finally {
      setBatchActionLoading(false);
    }
  };

  // --- Sophisticated Filtering Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Text Search
      const lower = searchTerm.toLowerCase();
      const referenceMatch = o.paymentReference?.toLowerCase().includes(lower);
      const phoneMatch = o.customer?.phone?.toLowerCase().includes(lower);
      const nameMatch = o.user?.name?.toLowerCase().includes(lower);
      const matchesSearch = referenceMatch || phoneMatch || nameMatch;

      // 2. Status Filter (Multi-select)
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(o.orderStatus);

      // 3. Date Filter
      let matchesDate = true;
      if (dateFilter !== "all") {
        const date = new Date(o.createdAt);
        const now = new Date();
        if (dateFilter === "today") {
          matchesDate = date.toDateString() === now.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = date >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesDate = date >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Pagination based on filtered results
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginated = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Helpers for Filter UI
  const isFilterActive = statusFilter.length > 0 || dateFilter !== "all" || searchTerm !== "";
  
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setDateFilter("all");
  };

  const toggleStatusFilter = (statusKey: string) => {
    setStatusFilter(prev => 
      prev.includes(statusKey) 
        ? prev.filter(s => s !== statusKey) 
        : [...prev, statusKey]
    );
  };

  if(loading) return (
    <div className="absolute sm:relative flex inset-0 sm:h-dvh items-center justify-center">
      <GridLoader size={18} color="#5B7763" />
    </div>
  )

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
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="border border-border/40 bg-white text-[#222222] px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> {loading ? "REFRESHING..." : "REFRESH"}
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white border border-border/40 p-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Left: Search */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-[#5B7763] transition-colors" />
          <Input
            placeholder="SEARCH ORDER #, PHONE OR NAME..."
            className="pl-11 pr-10 bg-secondary/20 border-border/40 text-[11px] uppercase tracking-wider h-12 rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-[#222222]"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Right: Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Multi-Select Filter */}
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
                    onSelect={() => setStatusFilter([])}
                    className="justify-center text-center text-[10px] uppercase tracking-wider font-bold text-[#222222] hover:bg-secondary/50 rounded-none cursor-pointer py-2"
                  >
                    CLEAR STATUS
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Selector */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
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

          {/* Global Reset Button */}
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
      <div className="bg-white border border-border/40 relative">
        {selectedOrders.size > 0 && (
          <div className="bg-[#eef1ef] border-b border-[#5B7763]/20 px-6 py-3 flex flex-wrap items-center justify-between gap-4 absolute top-0 left-0 right-0 z-10 w-full h-[53px]">
            <div className="flex items-center gap-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#5B7763] cursor-pointer ml-1.5"
                checked={paginated.length > 0 && paginated.every((o) => selectedOrders.has(o.paymentReference))}
                onChange={handleSelectAll}
              />
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#5B7763]">
                {selectedOrders.size} order{selectedOrders.size > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B7763]">Batch update to:</span>
              <select 
                disabled={batchActionLoading}
                onChange={(e) => { handleBatchStatusUpdate(e.target.value); e.target.value = ""; }}
                defaultValue=""
                className="h-8 text-[10px] uppercase tracking-wider w-[140px] border border-[#5B7763]/30 text-[#5B7763] font-bold rounded-none focus:outline-none px-2 bg-white disabled:opacity-50 cursor-pointer"
              >
                <option value="" disabled>Select Status</option>
                {Object.entries(STATUS_CONFIG).map(([k, c]) => (
                  <option key={k} value={k}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/20 h-[53px]">
                <th className="py-4 px-6 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[#5B7763] cursor-pointer ml-1.5"
                    checked={paginated.length > 0 && paginated.every((o) => selectedOrders.has(o.paymentReference))}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Customer</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap">Reference</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted">Payment</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted text-right">Total</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted hidden md:table-cell whitespace-nowrap">Date</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-text-muted text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-6 w-12 text-center">
                      <div className="w-4 h-4 border border-border/40 rounded-sm ml-1.5 bg-secondary animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary animate-pulse rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-secondary animate-pulse w-24"></div>
                          <div className="h-2 bg-secondary animate-pulse w-16"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 bg-secondary animate-pulse w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-secondary animate-pulse w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-secondary animate-pulse w-16"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-4 bg-secondary animate-pulse w-16 ml-auto"></div></td>
                    <td className="py-4 px-6 hidden md:table-cell"><div className="h-4 bg-secondary animate-pulse w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-6 bg-secondary animate-pulse w-6"></div></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted">
                      <div className="bg-secondary/20 p-4 rounded-full mb-4">
                         <SlidersHorizontal className="h-6 w-6 opacity-50" />
                      </div>
                      <p className="text-[13px] font-bold uppercase tracking-wider text-[#222222]">No orders found</p>
                      <p className="text-[11px] mt-2 tracking-wider">Try adjusting your filters or search query.</p>
                      {isFilterActive && (
                        <button onClick={clearFilters} className="mt-4 text-[11px] uppercase tracking-wider font-bold text-[#5B7763] hover:underline">
                          CLEAR ALL FILTERS
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order._id} className={`group transition-colors ${selectedOrders.has(order.paymentReference) ? 'bg-[#5B7763]/5' : 'hover:bg-secondary/10'}`}>
                    <td className="py-4 px-6 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-[#5B7763] cursor-pointer ml-1.5"
                        checked={selectedOrders.has(order.paymentReference)}
                        onChange={() => handleSelectOrder(order.paymentReference)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.user?.profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.name || "Guest")}`}
                          alt={order.user?.name || "Guest"}
                          className="w-9 h-9 object-cover border border-border/40 shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#222222] whitespace-nowrap">{order.user?.name ?? "Guest"}</span>
                          <span className="text-[11px] text-text-muted tracking-wider">{order.customer?.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-[11px] font-medium text-[#222222] whitespace-nowrap">
                      {order.paymentReference}
                    </td>

                    <td className="py-4 px-6">
                       <StatusSelector
                          current={order.orderStatus}
                          onChange={(v) => handleStatusUpdate(order.paymentReference, v)}
                        />
                    </td>

                    <td className="py-4 px-6">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>

                    <td className="py-4 px-6 text-right text-[13px] font-bold text-[#222222]">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="py-4 px-6 hidden md:table-cell text-[11px] text-text-muted tracking-wider whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-4 px-6">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/40">
                              <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none border-border/40 shadow-sm w-48">
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-text-muted font-bold px-3 py-2">Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsSheetOpen(true);
                            }}
                            className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                          >
                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              navigator.clipboard.writeText(order.paymentReference);
                              Toast.fire({ icon: "success", title: "COPIED TO CLIPBOARD" });
                            }}
                            className="text-[11px] uppercase tracking-wider font-bold text-[#222222] cursor-pointer rounded-none focus:bg-secondary/50 py-2.5 px-3"
                          >
                            <Copy className="mr-2 h-3.5 w-3.5" /> Copy Reference
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/40" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(order._id)} 
                            className="text-[11px] uppercase tracking-wider font-bold text-red-600 cursor-pointer rounded-none focus:bg-red-50 focus:text-red-700 py-2.5 px-3"
                          >
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="border-t border-border/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/10">
          <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1 || loading} 
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 flex items-center justify-center border border-border/40 bg-white text-text-muted hover:text-[#222222] hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button 
              disabled={page === totalPages || loading} 
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 flex items-center justify-center border border-border/40 bg-white text-text-muted hover:text-[#222222] hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS DIALOG */}
      <Dialog open={isSheetOpen} onOpenChange={(v) => { setIsSheetOpen(v); if (!v) setSelectedOrder(null); }}>
        <DialogContent showCloseButton={false} className="max-w-6xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#fdfbf7] rounded-none border border-border/40">
          {selectedOrder ? <OrderDetailsSheetContent order={selectedOrder} onDelete={handleDelete} onStatusChange={handleStatusUpdate} onClose={() => setIsSheetOpen(false)} /> : (
            <div className="p-8">
              <div className="h-6 bg-secondary animate-pulse w-44 mb-6"></div>
              <div className="h-48 bg-secondary animate-pulse w-full border border-border/40"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}