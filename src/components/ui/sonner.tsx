'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#222222] group-[.toaster]:border-border/40 group-[.toaster]:shadow-sm group-[.toaster]:rounded-none group-[.toaster]:font-sans",
          description: "group-[.toast]:text-text-muted group-[.toast]:text-[12px] group-[.toast]:tracking-wider",
          title: "group-[.toast]:text-[12px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          actionButton:
            "group-[.toast]:bg-[#5B7763] group-[.toast]:text-white group-[.toast]:rounded-none group-[.toast]:text-[11px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          cancelButton:
            "group-[.toast]:bg-secondary/50 group-[.toast]:text-text-muted group-[.toast]:rounded-none group-[.toast]:text-[11px] group-[.toast]:uppercase group-[.toast]:tracking-wider group-[.toast]:font-bold",
          success: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-[#5B7763]",
          error: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
