"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "@/lib/theme/provider";
import { cn } from "@/lib/utils/cn";

/**
 * Fades content in the first time it scrolls into view. Disabled when the
 * theme turns reveals off, and always disabled for `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const { theme } = useTheme();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const active = theme.motion.enabled && theme.motion.reveal;

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <Tag
      ref={ref as never}
      className={cn(active && "reveal", className)}
      data-visible={active ? visible : undefined}
    >
      {children}
    </Tag>
  );
}
