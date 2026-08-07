import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_CONFIG } from "./utils";

export default function StatusSelector({
  currentStatus,
  paymentReference,
  onUpdate,
}: {
  currentStatus: string;
  paymentReference: string;
  onUpdate: (ref: string, newStatus: string) => void;
}) {
  const conf = STATUS_CONFIG[currentStatus] || { label: currentStatus, color: "bg-secondary/50 text-[#222222] border-border/40" };
  return (
    <Select value={currentStatus} onValueChange={(v) => onUpdate(paymentReference, v)}>
      <SelectTrigger className={`h-8 text-[9px] uppercase tracking-wider w-[140px] border ${conf.color} font-bold rounded-none focus:ring-0 px-2 shadow-none`}>
        <SelectValue>{conf.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-none border-border/40 shadow-sm">
        {Object.entries(STATUS_CONFIG).map(([k, c]) => (
          <SelectItem key={k} value={k} className="text-[11px] uppercase tracking-wider rounded-none cursor-pointer focus:bg-secondary/50">
            <div className="flex items-center gap-2">
              <span>{c.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
