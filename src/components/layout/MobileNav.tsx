"use client";

import { HeartHandshake, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { buttonClasses } from "@/components/ui/ButtonLink";
import type { Cause } from "@/lib/cms/types";
import { NAV_LINKS, ROUTES } from "@/lib/site";
import { telHref } from "@/lib/utils";

type Props = {
  causes: Pick<Cause, "slug" | "title">[];
  donateUrl: string;
  phone: string;
};

export function MobileNav({ causes, donateUrl, phone }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink ring-1 ring-line lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      {/* Portalled to <body>: the header's backdrop-filter would otherwise
          become the containing block and trap this fixed panel inside it. */}
      {open ? createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4 sm:px-6">
            <Image src="/brand/sarvamangal-logo.png" alt="" width={1600} height={500} className="h-10 w-auto" />
            <button
              type="button"
              autoFocus
              onClick={close}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink ring-1 ring-line"
            >
              <X aria-hidden className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 px-4 py-6 sm:px-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-12 items-center font-display text-[1.65rem] text-ink"
                  >
                    {item.label}
                  </Link>
                  {"hasCauses" in item ? (
                    <ul className="mb-3 grid grid-cols-2 gap-2 pl-1">
                      {causes.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={ROUTES.cause(c.slug)}
                            onClick={close}
                            className="flex min-h-11 items-center rounded-xl bg-paper-2 px-4 text-ink-soft"
                          >
                            {c.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              <li>
                <Link href={ROUTES.contact} onClick={close} className="flex min-h-12 items-center font-display text-[1.65rem] text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sticky bottom-0 space-y-3 border-t border-line bg-white px-4 py-4 sm:px-6">
            <a href={donateUrl} className={buttonClasses("primary", "lg") + " w-full"}>
              <HeartHandshake aria-hidden />
              Donate now
            </a>
            <a href={telHref(phone)} className={buttonClasses("secondary", "md") + " w-full"}>
              <Phone aria-hidden />
              Call {phone}
            </a>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
