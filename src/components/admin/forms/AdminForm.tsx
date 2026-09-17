"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export interface FormActionState {
  error?: string;
  success?: boolean;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  pendingLabel = "Saving…",
  extraActions,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  children: ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  extraActions?: ReactNode;
}) {
  const [state, formAction] = useActionState<FormActionState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {children}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
        {extraActions}
        <div aria-live="polite">
          {state.error && (
            <span className="text-sm" style={{ color: "var(--p-danger)" }}>
              {state.error}
            </span>
          )}
          {state.success && (
            <span className="text-sm" style={{ color: "var(--p-success)" }}>
              Saved.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
