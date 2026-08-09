"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "primary";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver) resolver(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolver) resolver(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCancel(); }}>
        <DialogContent className="rounded-none border border-border/40 bg-white max-w-sm p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-[14px] uppercase tracking-widest font-bold text-[#222222]">
              {options?.title}
            </DialogTitle>
            <DialogDescription className="text-[12px] text-text-muted mt-2 tracking-wider">
              {options?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="rounded-none text-[11px] uppercase tracking-wider font-bold border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50"
            >
              {options?.cancelText || "Cancel"}
            </Button>
            <Button 
              onClick={handleConfirm}
              className={`rounded-none text-[11px] uppercase tracking-wider font-bold text-white ${
                options?.variant === "destructive" 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-[#5B7763] hover:bg-[#4a6252]"
              }`}
            >
              {options?.confirmText || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}
