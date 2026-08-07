"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function ShopPagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = parseInt(searchParams.get("page") || "1");

  if (totalPages <= 1) return null;

  const updateURL = (newPage: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="flex justify-center gap-2 mt-20 pt-10 border-t border-border/40">
      <button
        onClick={() => updateURL(Math.max(1, page - 1).toString())}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center border border-border/60 text-text-muted hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &larr;
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => updateURL(p.toString())}
            className={`w-10 h-10 flex items-center justify-center border transition-colors ${
              page === p
                ? "border-black bg-black text-white"
                : "border-border/60 text-text-muted hover:border-black hover:text-black"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => updateURL(Math.min(totalPages, page + 1).toString())}
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center border border-border/60 text-text-muted hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &rarr;
      </button>
    </div>
  );
}
