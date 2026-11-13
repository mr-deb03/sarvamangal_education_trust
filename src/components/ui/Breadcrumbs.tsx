import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** "Home › Camp register › This camp". The last crumb is the current page. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", dark ? "text-ink-200" : "text-ink-muted")}>
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
            {i > 0 ? <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-70" /> : null}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "inline-flex min-h-11 items-center hover:underline",
                  dark ? "hover:text-white" : "hover:text-crimson",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("truncate", dark ? "text-white" : "text-ink-soft")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
