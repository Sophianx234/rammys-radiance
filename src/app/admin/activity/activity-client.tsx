"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ActivityClient({ logs }: { logs: any[] }) {
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      <header className="flex flex-col gap-1 border-b border-border/40 pb-6">
        <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Activity Logs</h2>
        <p className="text-[12px] text-text-muted uppercase tracking-wider font-medium">
          Monitor all administrative actions
        </p>
      </header>
      
      <div className="bg-white border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 w-48">Timestamp</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 w-48">User</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 w-48">Action</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-[12px] text-text-muted">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id} className="hover:bg-secondary/10 border-border/40 transition-colors">
                    <TableCell className="text-[11px] font-medium text-text-muted whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#222222]">{log.user?.name}</span>
                        <span className="text-[9px] uppercase tracking-widest text-[#5B7763]">{log.user?.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[9px] uppercase tracking-widest font-bold bg-secondary/50 text-[#222222] border border-border/40">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-[12px] text-[#222222]">
                      {log.details}
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
