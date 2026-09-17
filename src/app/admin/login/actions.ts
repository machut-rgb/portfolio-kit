"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { login } from "@/lib/auth/login";
import { adminHref } from "@/lib/auth/config";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export interface LoginFormState {
  error?: string;
  retryAfterSeconds?: number;
}

export async function loginAction(_prev: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const result = await login(parsed.data.email, parsed.data.password);

  if (result.ok) {
    redirect(adminHref());
  }

  if (result.reason === "locked") {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(result.retryAfterSeconds / 60)} minute(s).`,
      retryAfterSeconds: result.retryAfterSeconds,
    };
  }

  // Deliberately generic — never confirm whether the email exists.
  return { error: "Incorrect email or password." };
}
