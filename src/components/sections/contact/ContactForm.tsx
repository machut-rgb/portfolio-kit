"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Status = "idle" | "sending" | "success" | "error" | "rate_limited";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary["form"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(dict.invalidEmail);
      return;
    }
    if (message.trim().length < 10) {
      setFieldError(dict.tooShort);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email,
          subject: data.get("subject"),
          message,
          company: data.get("company"), // honeypot
          locale,
        }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setStatus("success");
        form.reset();
      } else if (json.error === "rate_limited") {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-name" className="field-label">
            {dict.name}
          </label>
          <input id="f-name" name="name" type="text" required minLength={2} maxLength={120} className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-email" className="field-label">
            {dict.email}
          </label>
          <input id="f-email" name="email" type="email" required maxLength={200} className="field" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-subject" className="field-label">
          {dict.subject}
        </label>
        <input id="f-subject" name="subject" type="text" maxLength={200} className="field" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-message" className="field-label">
          {dict.message}
        </label>
        <textarea id="f-message" name="message" required minLength={10} maxLength={4000} rows={5} className="field resize-none" />
      </div>

      {/* Honeypot: hidden from sighted users and skipped by keyboard tab order. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-primary self-start" disabled={status === "sending"}>
        {status === "sending" ? dict.sending : dict.send}
      </button>

      <div aria-live="polite" className="min-h-[1.5em]">
        {fieldError && (
          <p className="text-sm" style={{ color: "var(--p-danger)" }}>
            {fieldError}
          </p>
        )}
        {status === "success" && (
          <p className="text-sm" style={{ color: "var(--p-success)" }}>
            {dict.success}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm" style={{ color: "var(--p-danger)" }}>
            {dict.error}
          </p>
        )}
        {status === "rate_limited" && (
          <p className="text-sm" style={{ color: "var(--p-warning)" }}>
            {dict.rateLimited}
          </p>
        )}
      </div>
    </form>
  );
}
