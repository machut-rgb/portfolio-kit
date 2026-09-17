import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/guard";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="flex">
      <AdminNav email={session.email} />
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  );
}
