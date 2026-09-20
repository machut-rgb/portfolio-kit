import { getSession } from "@/lib/auth/session";
import { hasAdminAccount } from "@/lib/auth/setup";
import { redirect } from "next/navigation";
import { adminHref } from "@/lib/auth/config";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (!(await hasAdminAccount())) redirect(adminHref("/setup"));

  const session = await getSession();
  if (session) redirect(adminHref());

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="eyebrow justify-center mb-2">Admin</div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--p-font-display)", color: "var(--p-fg)" }}>
            Sign in
          </h1>
        </div>
        <div className="card">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
