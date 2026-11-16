import Image from "next/image";
import type { ReactNode } from "react";

import type { ImageRef } from "@/lib/cms/types";
import { cn, focalStyle } from "@/lib/utils";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Props = {
  id: string;
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Buttons or facts under the intro. */
  children?: ReactNode;
  /** Ink band for the main pages; paper for policies. */
  tone?: "dark" | "light";
  /** A photo beside the title on desktop, under the intro on phones. */
  image?: ImageRef & { caption?: string };
};

/** The top of every inner page: breadcrumbs, the page's one <h1>, a line of intro. */
export function PageHeader({ id, crumbs, eyebrow, title, intro, children, tone = "dark", image }: Props) {
  const dark = tone === "dark";
  return (
    <section aria-labelledby={id} className={dark ? "on-ink" : "bg-paper-2"}>
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-14 lg:px-8">
        <Breadcrumbs tone={tone} items={crumbs} />
        <div className={cn(image && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-12")}>
          <div className={cn(image && "lg:col-span-7 lg:pb-4")}>
            <p className={cn("eyebrow mt-6", dark ? "text-marigold" : "text-crimson")}>{eyebrow}</p>
            <h1
              id={id}
              className={cn("mt-3 max-w-3xl text-[2.4rem] leading-[1.05] font-semibold sm:text-6xl", dark && "text-white")}
            >
              {title}
            </h1>
            {intro ? (
              <p
                className={cn(
                  "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg",
                  dark ? "text-ink-200" : "text-ink-muted",
                )}
              >
                {intro}
              </p>
            ) : null}
            {children}
          </div>

          {image ? (
            <figure className="mt-8 lg:col-span-5 lg:mt-0">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem] bg-white/5 shadow-[0_40px_70px_-40px_rgb(0_0_0/0.6)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  preload
                  quality={80}
                  sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  style={focalStyle(image)}
                />
              </div>
              {image.caption ? (
                <figcaption className={cn("mt-3 text-sm", dark ? "text-ink-200" : "text-ink-muted")}>
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
