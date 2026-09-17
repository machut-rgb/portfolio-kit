"use client";

import { useTheme } from "@/lib/theme/provider";
import { Icon } from "@/components/ui/Icon";

export function ModeToggle({ label }: { label: string }) {
  const { mode, resolvedMode, setMode } = useTheme();

  return (
    <button
      type="button"
      className="btn-ghost inline-flex items-center justify-center rounded-[var(--p-radius-sm)] w-9 h-9"
      onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
      aria-label={label}
      title={mode === "system" ? `${label} (system)` : label}
    >
      <Icon name={resolvedMode === "dark" ? "sun" : "moon"} />
    </button>
  );
}
