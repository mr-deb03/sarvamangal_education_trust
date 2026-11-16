import { ChevronDown, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Cause, SiteCopy, SiteSettings } from "@/lib/cms/types";
import { fill } from "@/lib/format";
import { ROUTES } from "@/lib/site";

import { EscapeCloses } from "./EscapeCloses";
import { HomeLink } from "./HomeLink";
import { MobileNav } from "./MobileNav";

type Props = {
  settings: SiteSettings;
  causes: Pick<Cause, "slug" | "title" | "tagline">[];
  copy: SiteCopy;
};

const navLink = "inline-flex min-h-11 items-center rounded-full px-4 font-medium text-ink-soft transition-colors hover:text-crimson";

export function Header({ settings, causes, copy }: Props) {
  const { identity } = settings;
  const { nav } = copy.layout;
  const a11y = copy.labels.accessibility;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white sm:bg-white/90 sm:backdrop-blur-md sm:supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[4.75rem] lg:px-8">
        <HomeLink className="shrink-0 rounded-md" aria-label={fill(a11y.homeLink, { siteName: identity.siteName })}>
          {/* Not preloaded: on every page the real first image (hero, cover photo) needs the bandwidth more. */}
          <Image
            src={identity.logo.src}
            alt=""
            width={identity.logo.width ?? 1600}
            height={identity.logo.height ?? 500}
            sizes="160px"
            className="h-10 w-auto lg:h-11"
          />
        </HomeLink>

        <nav aria-label={a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((item, i) =>
              item.showCauses && causes.length > 0 ? (
                <li key={`${item.href}-${i}`} className="group relative">
                  <EscapeCloses>
                    <Link href={item.href} className={`${navLink} gap-1`}>
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
                      />
                    </Link>
                    {/* Opens on hover and on keyboard focus; Escape closes it (EscapeCloses). */}
                    <div className="invisible absolute top-full left-1/2 z-50 w-[22rem] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 group-data-[dismissed]:invisible! group-data-[dismissed]:opacity-0!">
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
                  </EscapeCloses>
                </li>
              ) : (
                <li key={`${item.href}-${i}`}>
                  <Link href={item.href} className={navLink}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={settings.donateUrl} size="sm" className="px-4 sm:px-5">
            <HeartHandshake aria-hidden />
            {nav.donate}
          </ButtonLink>
          <MobileNav
            causes={causes}
            links={[...nav.links, ...nav.mobileLinks]}
            donateUrl={settings.donateUrl}
            phone={settings.contact.phone}
            logo={identity.logo}
            text={{
              donate: nav.mobileDonate,
              call: fill(nav.call, { phone: settings.contact.phone }),
              open: a11y.openMenu,
              close: a11y.closeMenu,
              menu: a11y.menu,
              mainNav: a11y.mainNav,
            }}
          />
        </div>
      </div>
    </header>
  );
}
