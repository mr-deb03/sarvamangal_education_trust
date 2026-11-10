import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  /** Donate and other primary asks. */
  primary:
    "bg-crimson text-white shadow-[0_10px_24px_-10px_rgb(200_16_58/0.6)] hover:bg-crimson-deep",
  secondary: "bg-white text-ink ring-1 ring-inset ring-ink/15 hover:bg-paper-2 hover:ring-ink/35",
  /** On ink backgrounds. */
  marigold: "bg-marigold text-ink hover:brightness-105",
  /** On crimson backgrounds. */
  white: "bg-white text-crimson hover:bg-paper-2",
  "outline-light": "text-white ring-1 ring-inset ring-white/45 hover:bg-white/10",
} as const;

const sizes = {
  sm: "min-h-11 px-4 text-[0.95rem]",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-7 text-[1.0625rem]",
} as const;

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function buttonClasses(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md") {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold tracking-[0.005em] whitespace-nowrap",
    "transition-[background-color,box-shadow,filter,transform] duration-200 motion-safe:active:scale-[0.98]",
    "[&_svg]:size-[1.15em] [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
  );
}

/** A link styled as a button. External URLs render a plain <a>. */
export function ButtonLink({ href, variant, size, className, children, ...rest }: Props) {
  const classes = cn(buttonClasses(variant, size), className);
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
