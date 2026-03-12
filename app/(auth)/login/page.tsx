"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

function LoginFormFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6">
        <div className="space-y-1 mb-4">
          <div className="h-5 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-muted animate-pulse" />
            <div className="h-8 w-full rounded border bg-muted animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-8 w-full rounded border bg-muted animate-pulse" />
          </div>
          <div className="h-8 w-full rounded bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
