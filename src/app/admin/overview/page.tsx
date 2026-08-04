"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  Search,
  Filter,
  XCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useRouter } from "next/navigation";
import { GridLoader } from "react-spinners";

// ------------------ Types -------------------

type OrderStatus =
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
  | "cancelled";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  descriptions: {
    revenue?: string;
    orders?: string;
    customers?: string;
    stock?: string;
  };
}

interface RecentOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  avatar?: string;
}

interface StockAlert {
  _id: string;
  name: string;
  stock: number;
  price: number;
  images: string[];
}

// ------------------ Helpers -------------------

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);

const getStatusColor = (status: OrderStatus) => {
  const map: Record<OrderStatus, string> = {
    delivered: "border-[#5B7763] text-[#5B7763] bg-[#5B7763]/5",
    processing: "border-[#222222] text-[#222222] bg-secondary/30",
    cancelled: "border-red-600 text-red-600 bg-red-50",
    in_transit: "border-[#222222] text-[#222222] bg-secondary/30",
    awaiting_payment: "border-[#222222] text-[#222222] bg-secondary/30",
    awaiting_pickup: "border-[#222222] text-[#222222] bg-secondary/30",
    packed: "border-[#222222] text-[#222222] bg-secondary/30",
    ready_for_dispatch: "border-[#222222] text-[#222222] bg-secondary/30",
    dispatched: "border-[#222222] text-[#222222] bg-secondary/30",
    arrived: "border-[#5B7763] text-[#5B7763] bg-[#5B7763]/5",
    delivery_attempted: "border-orange-600 text-orange-600 bg-orange-50",
    paid: "border-[#5B7763] text-[#5B7763] bg-[#5B7763]/5",
  };

  return map[status] || "border-border/40 text-text-muted bg-transparent";
};

// ------------------ Component -------------------

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Data State
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    descriptions: {},
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [salesChartData, setSalesChartData] = useState([]);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ------------------ Fetch Data -------------------

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, ordersRes, salesRes, stockRes] = await Promise.all([
          fetch("/api/admin/dashboard/stats", { cache: "no-store" }),
          fetch(
            `/api/admin/dashboard/recent-orders?status=${statusFilter}&search=${searchQuery}`,
            { cache: "no-store" }
          ),
          fetch("/api/admin/dashboard/sales", { cache: "no-store" }),
          fetch("/api/admin/dashboard/stock-alerts", { cache: "no-store" }),
        ]);

        if (!statsRes.ok || !ordersRes.ok || !salesRes.ok || !stockRes.ok) {
          throw new Error("One of the APIs failed");
        }

        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        const salesData = await salesRes.json();
        const stockData = await stockRes.json();

        setStats({
          totalRevenue: statsData.totalRevenue,
          totalOrders: statsData.totalOrders,
          totalCustomers: statsData.totalCustomers,
          lowStockCount: statsData.lowStockCount,
          descriptions: statsData.descriptions,
        });

        setRecentOrders(ordersData.orders || []);
        setSalesChartData(salesData.salesData || []);
        setStockAlerts(stockData.stockAlerts || []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [searchQuery, statusFilter]);

  // --- Filtering Logic ---
  const filteredOrders = recentOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="absolute sm:relative flex inset-0 sm:h-[80vh] items-center justify-center">
        <GridLoader size={18} color="#5B7763" />
      </div>
    );
  }

  // ------------------ UI -------------------

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Overview</h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Insight into your store performance and operations
          </p>
        </div>
        <button className="bg-[#5B7763] text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors w-fit">
          Download Report
        </button>
      </header>

      {/* ---------- STATS CARDS ---------- */}
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", icon: DollarSign, value: `₵${stats.totalRevenue}`, desc: stats.descriptions?.revenue },
          { title: "Orders", icon: ShoppingBag, value: stats.totalOrders, desc: stats.descriptions?.orders },
          { title: "Active Customers", icon: Users, value: stats.totalCustomers, desc: stats.descriptions?.customers },
          { title: "Low Stock Items", icon: Package, value: stats.lowStockCount, desc: stats.descriptions?.stock }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border/40 p-5 flex flex-col justify-between h-full hover:border-[#5B7763]/30 transition-colors group cursor-default">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-wider font-bold text-text-muted group-hover:text-[#222222] transition-colors">{stat.title}</h3>
              <stat.icon className="w-4 h-4 text-[#5B7763]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-light text-[#222222] mb-1">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-muted/70">{stat.desc || "N/A"}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- SALES + INVENTORY ---------- */}
      <section className="grid gap-6 lg:grid-cols-7">
        {/* SALES CHART */}
        <div className="bg-white border border-border/40 col-span-4 p-6">
          <div className="mb-6">
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">Sales Overview</h3>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Daily revenue for this week</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B7763" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#5B7763" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#737373" }}
                  dy={10}
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#737373" }}
                  tickFormatter={(v) => `₵${v}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "0", border: "1px solid #E5E5E5", fontSize: "12px", color: "#222222" }}
                  itemStyle={{ color: "#5B7763", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#5B7763"
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INVENTORY ALERTS */}
        <div className="bg-white border border-border/40 col-span-3 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">Inventory Alerts</h3>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Products running low on stock</p>
          </div>
          
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            {stockAlerts.map((item) => (
              <div key={item._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary border border-border/40 flex-shrink-0 relative overflow-hidden">
                    <img
                      src={item?.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#222222] line-clamp-1">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#5B7763] mt-0.5">
                      {item.stock === 0
                        ? "Out of stock"
                        : `Only ${item.stock} left`}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] font-medium text-[#222222]">₵{item.price}</p>
              </div>
            ))}

            {stockAlerts.length === 0 && (
              <p className="text-[11px] uppercase tracking-wider text-text-muted text-center py-10 border border-dashed border-border/40">
                Inventory looks good!
              </p>
            )}
          </div>

          <button
            className="w-full mt-6 bg-secondary/50 text-[#222222] border border-border/40 px-5 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors"
            onClick={() => router.push("/admin/inventory")}
          >
            View All Inventory
          </button>
        </div>
      </section>

      {/* ---------- RECENT ORDERS ---------- */}
      <div className="bg-white border border-border/40">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-6 border-b border-border/40">
          <div>
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#222222]">Recent Orders</h3>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
              {filteredOrders.length} orders match your filters
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <div className="w-full sm:w-[160px] relative">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-none border-border/40 h-10 text-[12px] bg-secondary/20 focus:ring-0 focus:border-[#5B7763]">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-none border-border/40">
                  <SelectItem value="all" className="text-[12px]">All Statuses</SelectItem>
                  <SelectItem value="processing" className="text-[12px]">Processing</SelectItem>
                  <SelectItem value="awaiting_payment" className="text-[12px]">Awaiting Payment</SelectItem>
                  <SelectItem value="awaiting_pickup" className="text-[12px]">Awaiting Pickup</SelectItem>
                  <SelectItem value="in_transit" className="text-[12px]">In Transit</SelectItem>
                  <SelectItem value="delivered" className="text-[12px]">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-[12px]">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" strokeWidth={1.5} />
              <Input
                placeholder="Search name, email, ID..."
                className="pl-9 rounded-none border-border/40 h-10 text-[12px] bg-secondary/20 focus-visible:ring-0 focus-visible:border-[#5B7763] placeholder:text-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View All */}
            <button
              onClick={() => router.push("/admin/orders")}
              className="hidden sm:flex items-center justify-center h-10 w-10 border border-border/40 hover:bg-secondary/50 transition-colors text-text-muted hover:text-[#222222]"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Customer</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Order ID</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Date</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-text-muted border-border/40"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <XCircle className="h-6 w-6 text-border" strokeWidth={1.5} />
                      <p className="text-[12px]">No orders found matching your filters.</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="text-[#5B7763] text-[11px] uppercase tracking-wider font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id} className="border-border/40 hover:bg-secondary/20 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary flex items-center justify-center text-[13px] font-bold text-[#222222] border border-border/40">
                          {order.avatar ? (
                            <img src={order.avatar} className="w-full h-full object-cover" alt={order.customerName} />
                          ) : (
                            order.customerName.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#222222]">{order.customerName}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">{order.customerEmail}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-[12px] text-text-muted">
                      {order._id}
                    </TableCell>

                    <TableCell>
                      <div className={`inline-flex px-2 py-1 text-[9px] uppercase tracking-wider font-bold border ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </div>
                    </TableCell>

                    <TableCell className="text-[12px] text-text-muted">
                      {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>

                    <TableCell className="text-right text-[13px] font-medium text-[#222222]">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
