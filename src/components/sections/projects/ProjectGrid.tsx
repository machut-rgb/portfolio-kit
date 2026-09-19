"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/lib/content/types";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils/cn";

export function ProjectGrid({
  projects,
  tags,
  locale,
  variant,
  allLabel,
  detailPagesEnabled,
}: {
  projects: Project[];
  tags: string[];
  locale: Locale;
  variant: "grid" | "list";
  allLabel: string;
  detailPagesEnabled: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = useMemo(
    () => (active ? projects.filter((p) => p.tags.includes(active)) : projects),
    [projects, active],
  );

  return (
    <div>
      {tags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8" role="group">
          <button type="button" onClick={() => setActive(null)} className={cn("pill", !active && "pill-active")}>
            {allLabel}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              className={cn("pill", active === tag && "pill-active")}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className={variant === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            list={variant === "list"}
            detailPagesEnabled={detailPagesEnabled}
          />
        ))}
      </div>
    </div>
  );
}
