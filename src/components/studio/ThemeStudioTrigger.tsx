"use client";

import { useStudio } from "./context";
import { Icon } from "@/components/ui/Icon";

export function ThemeStudioTrigger({ label }: { label: string }) {
  const { setOpen } = useStudio();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="btn-ghost w-9 h-9 inline-flex items-center justify-center rounded-[var(--p-radius-sm)]"
      aria-label={label}
      title={label}
    >
      <Icon name="palette" />
    </button>
  );
}
