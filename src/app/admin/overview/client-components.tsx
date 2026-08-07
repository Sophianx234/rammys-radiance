"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Link from "next/link";
import Image from "next/image";

export function RecentOrdersFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const statusFilter = searchParams.get("status") || "all";
  const searchQuery = searchParams.get("search") || "";

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
        <Input 
          placeholder="Search orders..." 
          className="pl-9 h-11 bg-white border-border/40 focus-visible:ring-[#222222]" 
          value={searchQuery}
          onChange={(e) => updateURL({ search: e.target.value })}
        />
      </div>
      <Select 
        value={statusFilter} 
        onValueChange={(val) => updateURL({ status: val === "all" ? "" : val })}
      >
        <SelectTrigger className="w-full sm:w-[180px] h-11 bg-white border-border/40 focus:ring-[#222222]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="dispatched">Dispatched</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SalesChartClient({ data }: { data: any[] }) {
  return (
    <div className="h-[350px] mt-6 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5B7763" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#5B7763" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `₵${value}`} dx={-10} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#222222', color: 'white', borderRadius: '4px', border: 'none', padding: '12px' }}
            itemStyle={{ color: 'white', fontSize: '13px', fontWeight: '500' }}
            formatter={(value: number) => [`₵${value.toLocaleString()}`, 'Sales']}
          />
          <Area type="monotone" dataKey="sales" stroke="#5B7763" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
