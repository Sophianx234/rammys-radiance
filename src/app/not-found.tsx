import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-surface text-center px-4 font-sans antialiased">
      <h2 className="text-3xl font-bold uppercase tracking-widest text-text-main mb-4">404</h2>
      <p className="text-[12px] uppercase tracking-widest text-text-muted mb-8">Page Not Found</p>
      <Link href="/" className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-black/80 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
