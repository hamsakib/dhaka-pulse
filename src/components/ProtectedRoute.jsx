"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/** Renders children only for signed-in users; everyone else is sent to /login. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-fg" role="status">
        <Loader2 className="h-5 w-5 animate-spin" /> {loading ? "Checking your session…" : "Redirecting to login…"}
      </div>
    );
  }
  return children;
}
