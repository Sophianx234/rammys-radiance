import { PaymentStatus } from "./page";

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    paid: "bg-[#5B7763]/10 text-[#5B7763] border-[#5B7763]/20",
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
}