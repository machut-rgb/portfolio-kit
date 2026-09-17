import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "./Icon";

type Variant = "primary" | "outline" | "ghost";

interface Common {
  variant?: Variant;
  size?: "md" | "sm";
  icon?: string;
  iconPosition?: "start" | "end";
  className?: string;
  children?: ReactNode;
}

const classes = (variant: Variant = "primary", size: "md" | "sm" = "md", className?: string) =>
  cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);

export function Button({
  variant,
  size,
  icon,
  iconPosition = "end",
  className,
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {icon && iconPosition === "start" && <Icon name={icon} />}
      {children}
      {icon && iconPosition === "end" && <Icon name={icon} />}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconPosition = "end",
  className,
  children,
  href,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const content = (
    <>
      {icon && iconPosition === "start" && <Icon name={icon} />}
      {children}
      {icon && iconPosition === "end" && <Icon name={icon} />}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {content}
    </Link>
  );
}
