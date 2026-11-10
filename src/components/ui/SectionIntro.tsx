import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  id: string;
  /** Small capitals label above the title. */
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export function SectionIntro({ id, eyebrow, title, children, tone = "light", align = "left", className }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow", dark ? "text-marigold" : "text-crimson")}>{eyebrow}</p>
      <h2
        id={id}
        className={cn(
          "mt-3 text-[2.15rem] font-semibold tracking-[-0.015em] sm:text-5xl",
          dark && "text-white",
        )}
      >
        {title}
      </h2>
      {children ? (
        <div className={cn("mt-5 text-lg leading-relaxed", dark ? "text-ink-200" : "text-ink-muted")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
