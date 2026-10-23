import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <div className="container-x flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="h1 text-center">Create your account</h1>
        <p className="lead mt-2 text-center">Free, and it takes less than a minute.</p>
        <div className="mt-8">
          <Suspense>
            <AuthForm mode="register" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
