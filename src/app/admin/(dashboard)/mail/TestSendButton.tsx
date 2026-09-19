"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendTestMessageAction, type TestSendState } from "./actions";
import { Icon } from "@/components/ui/Icon";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-outline btn-sm" disabled={pending}>
      <Icon name="mail" />
      {pending ? "Sending…" : "Send a test message"}
    </button>
  );
}

export function TestSendButton() {
  const [state, action] = useActionState<TestSendState, FormData>(sendTestMessageAction, {});

  return (
    <form action={action} className="flex flex-col gap-2">
      <Submit />
      <div aria-live="polite" className="min-h-[1.25em]">
        {state.message && (
          <span className="text-xs" style={{ color: state.ok ? "var(--p-success)" : "var(--p-danger)" }}>
            {state.message}
          </span>
        )}
      </div>
      <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
        Uses the settings currently saved, not the ones typed above. Save first.
      </span>
    </form>
  );
}
