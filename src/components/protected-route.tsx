"use client"

import type React from "react"
import { useDashStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user } = useDashStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (!user) {
        router.push("/login")
      } else if (adminOnly && user.role !== "admin") {
        router.push("/")
      }
    }
  }, [user, router, adminOnly, isMounted])

  if (!isMounted || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (adminOnly && user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
