import { AlertTriangle, CheckCircle2, Clock, Home, Navigation, Package, PackageCheck, Truck, TruckIcon, XCircle } from "lucide-react";

interface TrackOrderCardProps {
  status: 'completed' | 'current' | 'upcoming'
  title: string
  iconKey?: string
  date?: string
  location?: string
  description?: string
  nextStatus?: 'completed' | 'current' | 'upcoming' | null
}

const getStatusIcon = (key: string) => {
  switch (key) {
    case "processing":
      return <Clock className="w-6 h-6" />;
    case "in_transit":
      return <Truck className="w-6 h-6" />;
    case "arrived":
      return <Home className="w-6 h-6" />;
    case "delivered":
      return <CheckCircle2 className="w-6 h-6" />;
    case "cancelled":
      return <XCircle className="w-6 h-6" />;
    default:
      return <Clock className="w-6 h-6" />;
  }
};

export default function TrackOrderCard({ status, date, location, description, title, nextStatus, iconKey }: TrackOrderCardProps) {
  
  return (
    <div className="flex gap-6 relative pb-10 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-6 top-12 bottom-0 w-[1px] bg-border/50" 
           style={{ display: nextStatus ? 'block' : 'none' }} />
      
      {/* Icon Node */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`w-12 h-12 flex items-center justify-center border
            ${
              status === "completed"
                ? "bg-[#5B7763] text-white border-[#5B7763]"
                : status === "current"
                ? "bg-white text-[#5B7763] border-[#5B7763]"
                : "bg-zinc-50 text-zinc-300 border-border/40" // upcoming
            }
          `}
        >
          {getStatusIcon(iconKey || title.toLowerCase())}
        </div>
      </div>

      {/* Content */}
      <div className="pt-2">
        <p className={`text-[12px] font-bold uppercase tracking-widest ${status === 'upcoming' ? 'text-zinc-400' : 'text-[#222222]'}`}>
          {status === 'completed' || status === 'current' ? title : status}
        </p>
        
        {description && (
          <p className="text-[13px] text-text-muted mt-1">{description}</p>
        )}
        
        {location && (
          <p className="text-[11px] text-text-muted mt-2 flex items-center gap-1 uppercase tracking-wider">
            <span className="w-1 h-1 bg-[#5B7763] rounded-full inline-block" /> {location}
          </p>
        )}
        
        {date ? (
          <p className="text-[11px] text-text-muted mt-2 font-medium">
            {new Date(date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })} • {" "}
            {new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        ) : (
          <p className="text-[11px] text-zinc-400 mt-2 uppercase tracking-wider">Pending</p>
        )}
      </div>
    </div>
  )
}
