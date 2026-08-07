"use client";

import { GridLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F9F9F9]">
      <GridLoader size={18} color="#5B7763" />
    </div>
  );
}
