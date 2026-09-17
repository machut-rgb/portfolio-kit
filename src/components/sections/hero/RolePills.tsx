"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

/** The first role is always shown active; on wide screens the rest fan out
 *  as pills, on narrow screens they cycle to save space. */
export function RolePills({ roles, className }: { roles: string[]; className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const id = setInterval(() => setActive((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {roles.map((role, i) => (
        <span key={role} className={cn("pill", i === active && "pill-active")}>
          {role}
        </span>
      ))}
    </div>
  );
}
