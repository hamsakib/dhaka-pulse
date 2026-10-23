import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="container-x flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="h1 text-center">Welcome back</h1>
        <p className="lead mt-2 text-center">Log in to add and manage your events.</p>
        <div className="mt-8">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
