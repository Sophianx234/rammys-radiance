"use client";

import { GridLoader } from "react-spinners";

export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <GridLoader size={18} color="#5B7763" />
      
    </div>
  );
}
