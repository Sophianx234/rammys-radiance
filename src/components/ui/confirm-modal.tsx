"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "primary";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary"
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-none border border-border/40 bg-white max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[14px] uppercase tracking-widest font-bold text-[#222222]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[12px] text-text-muted mt-2 tracking-wider">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-none text-[11px] uppercase tracking-wider font-bold border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-none text-[11px] uppercase tracking-wider font-bold text-white ${
              variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-[#5B7763] hover:bg-[#4a6252]"
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
