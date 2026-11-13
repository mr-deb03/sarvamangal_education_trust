import { Quote } from "lucide-react";
import Image from "next/image";

import type { Testimonial } from "@/lib/cms/types";
import { cn, focalStyle } from "@/lib/utils";

/** Brand colours for initials, given out in list order. */
export const INITIALS_STYLES = ["bg-crimson text-white", "bg-ink text-white", "bg-marigold text-ink"];

/** One supporter's quote. Shared by the still list (server) and the moving wall (browser). */
export function TestimonialCard({ t, tone }: { t: Testimonial; tone?: string }) {
  return (
    <figure className="rounded-2xl bg-paper-2 p-6 ring-1 ring-line sm:p-7">
      <figcaption className="flex items-center gap-3.5">
        <Avatar t={t} tone={tone} />
        <span className="min-w-0">
          <span className="block font-display text-lg leading-tight font-semibold text-ink">{t.name}</span>
          {t.role ? <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{t.role}</span> : null}
        </span>
      </figcaption>
      <Quote aria-hidden className="mt-5 size-6 text-crimson" strokeWidth={1.5} />
      <blockquote className="mt-2 leading-relaxed text-ink-soft">{t.quote}</blockquote>
      {t.supporterSince ? (
        <p className="mt-4 text-sm font-semibold text-crimson">Supporter since {t.supporterSince}</p>
      ) : null}
    </figure>
  );
}

/** The person's photo (from /admin), or their initials until one is uploaded. */
function Avatar({ t, tone = INITIALS_STYLES[0] }: { t: Testimonial; tone?: string }) {
  if (t.photo) {
    return (
      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-line ring-2 ring-white">
        {/* alt="" — the name is right beside the photo. Eager: a few tiny files, and the moving
            wall repeats them, so waiting for each copy to scroll into view made faces pop in late. */}
        <Image
          src={t.photo.src}
          alt=""
          fill
          sizes="56px"
          loading="eager"
          className="object-cover"
          style={focalStyle(t.photo)}
        />
      </span>
    );
  }
  const words = t.name.trim().split(/\s+/);
  const initials = `${words[0]?.[0] ?? ""}${words.length > 1 ? (words.at(-1)?.[0] ?? "") : ""}`.toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-full font-display text-xl font-semibold ring-2 ring-white",
        tone,
      )}
    >
      {initials}
    </span>
  );
}
