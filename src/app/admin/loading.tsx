"use client";

import { GridLoader } from "react-spinners";

export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <GridLoader size={18} color="#5B7763" />
      <p className="text-[13px] text-gray-500 font-medium uppercase tracking-widest animate-pulse mt-4">
        Loading...
      </p>
    </div>
  );
}
