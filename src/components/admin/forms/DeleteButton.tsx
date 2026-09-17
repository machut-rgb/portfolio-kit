"use client";

import { useTransition } from "react";
import { Icon } from "@/components/ui/Icon";

export function DeleteButton({
  action,
  confirmMessage = "Delete this? This can't be undone.",
  label,
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="btn-ghost btn-sm"
      style={{ color: "var(--p-danger)" }}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
    >
      <Icon name="close" />
      {label ?? (pending ? "Deleting…" : "Delete")}
    </button>
  );
}
