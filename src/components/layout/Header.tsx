import { ChevronDown, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Cause } from "@/lib/cms/types";
import { NAV_LINKS, ROUTES, SITE_NAME } from "@/lib/site";

import { HomeLink } from "./HomeLink";
import { MobileNav } from "./MobileNav";

type Props = {
  causes: Pick<Cause, "slug" | "title" | "tagline">[];
  donateUrl: string;
  phone: string;
};

export function Header({ causes, donateUrl, phone }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white sm:bg-white/90 sm:backdrop-blur-md sm:supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[4.75rem] lg:px-8">
        <HomeLink className="shrink-0 rounded-md" aria-label={`${SITE_NAME} — home`}>
          <Image
            src="/brand/sarvamangal-logo.png"
            alt=""
            width={1600}
            height={500}
            preload
            sizes="160px"
            className="h-10 w-auto lg:h-11"
          />
        </HomeLink>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((item) =>
              "hasCauses" in item ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center gap-1 rounded-full px-4 font-medium text-ink-soft transition-colors hover:text-crimson"
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                    />
                  </Link>
                  {/* Opens on hover and on keyboard focus — no JS needed. */}
                  <div className="invisible absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="rounded-2xl bg-white p-2 shadow-[0_24px_48px_-20px_rgb(23_25_59/0.35)] ring-1 ring-line">
                      {causes.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={ROUTES.cause(c.slug)}
                            className="flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-paper-2"
                          >
                            <span className="font-display text-lg leading-tight text-ink">{c.title}</span>
                            <span className="text-sm text-ink-muted">{c.tagline}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-full px-4 font-medium text-ink-soft transition-colors hover:text-crimson"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={donateUrl} size="sm" className="px-4 sm:px-5">
            <HeartHandshake aria-hidden />
            Donate
          </ButtonLink>
          <MobileNav causes={causes} donateUrl={donateUrl} phone={phone} />
        </div>
      </div>
    </header>
  );
}
