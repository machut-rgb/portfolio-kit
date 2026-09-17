"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth/session";
import { logAudit } from "@/lib/auth/audit";
import { getSession } from "@/lib/auth/session";
import { adminHref } from "@/lib/auth/config";

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) await logAudit({ actorId: session.id, action: "logout" });
  await destroySession();
  redirect(`${adminHref("/login")}`);
}
