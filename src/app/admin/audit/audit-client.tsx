"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ShieldAlert, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Image from "next/image";

interface UserProfile {
  name: string;
  email?: string;
  role: string;
  profile?: string;
}

interface AuditLog {
  _id: string;
  user: UserProfile;
  actionType: string;
  description: string;
  targetId?: string;
  entityType?: string;
  createdAt: string;
}

interface AuditClientProps {
  initialLogs: AuditLog[];
  pagination: any;
  currentSearch: string;
  currentActionTypes: string[];
}

export default function AuditClient({ initialLogs, pagination, currentSearch, currentActionTypes }: AuditClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const actionType = searchParams.get("actionType") || "all";

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getActionColor = (type: string) => {
    if (type.includes("DELETE") || type.includes("REMOVE")) return "bg-red-50 text-red-600 border-red-200";
    if (type.includes("UPDATE") || type.includes("EDIT")) return "bg-orange-50 text-orange-600 border-orange-200";
    if (type.includes("CREATE") || type.includes("ADD")) return "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20";
    if (type.includes("AUTH") || type.includes("LOGIN")) return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#5B7763]" />
            Audit Logs
          </h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Monitor administrative actions and security events
          </p>
        </div>
      </header>

      {/* ---------- FILTERS ---------- */}
      <div className="bg-white border border-border/40 p-5">
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Search audit descriptions..."
              value={search}
              onChange={(e) => updateURL({ search: e.target.value })}
              className="w-full bg-secondary/20 border-border/40 text-[12px] pl-9 h-10 placeholder:text-text-muted text-[#222222] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] transition-colors"
            />
          </div>

          <Select onValueChange={(val) => updateURL({ actionType: val })} value={actionType}>
            <SelectTrigger className="w-full lg:w-[220px] bg-secondary/20 border-border/40 text-[12px] text-[#222222] h-10 rounded-none focus:ring-0 focus:border-[#5B7763]">
              <div className="flex items-center gap-2 text-text-muted">
                <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
                <SelectValue placeholder="All Actions" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/40">
              <SelectItem value="all" className="text-[12px]">All Actions</SelectItem>
              <SelectItem value="CREATE" className="text-[12px]">Creations</SelectItem>
              <SelectItem value="UPDATE" className="text-[12px]">Updates</SelectItem>
              <SelectItem value="DELETE" className="text-[12px]">Deletions</SelectItem>
              <SelectItem value="AUTH" className="text-[12px]">Auth Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-white border border-border/40 rounded-none overflow-hidden">
        {initialLogs.length === 0 ? (
          <div className="text-center p-16 flex flex-col items-center justify-center gap-4">
            <History className="w-8 h-8 text-text-muted/30" />
            <p className="text-text-muted text-[12px]">No audit logs found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/40 border-b border-border/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-text-muted uppercase tracking-wider py-4 w-[250px]">
                    User
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-text-muted uppercase tracking-wider py-4">
                    Action Type
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-text-muted uppercase tracking-wider py-4">
                    Description
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-text-muted uppercase tracking-wider py-4 w-[150px] text-right">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialLogs.map((log) => (
                  <TableRow key={log._id} className="group border-b border-border/40 hover:bg-secondary/20 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        {log.user.profile ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border/40">
                            <Image
                              src={log.user.profile}
                              alt={log.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border/40 text-[10px] font-bold text-[#5B7763]">
                            {log.user.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-[#222222]">
                            {log.user.name}
                          </span>
                          {log.user.email && (
                            <span className="text-[10px] text-text-muted truncate max-w-[150px]">
                              {log.user.email}
                            </span>
                          )}
                          <span className="text-[9px] uppercase tracking-wider text-[#5B7763] font-bold mt-0.5">
                            {log.user.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getActionColor(log.actionType)}`}>
                        {log.actionType.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-[12px] text-[#222222] max-w-[400px]">
                        {log.description}
                      </p>
                      {log.targetId && (
                        <span className="text-[10px] text-text-muted font-mono mt-1 block">
                          ID: {log.targetId}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-medium text-[#222222]">
                          {format(new Date(log.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {format(new Date(log.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-6">
          <p className="text-[11px] text-text-muted uppercase tracking-wider font-bold">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updateURL({ page: String(pagination.currentPage - 1) })}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-border/40 hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#222222] transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => updateURL({ page: String(pagination.currentPage + 1) })}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-border/40 hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#222222] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
