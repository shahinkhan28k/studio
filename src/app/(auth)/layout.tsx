
"use client"
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {children}
    </div>
  )
}
