"use client";

import { HeartHandshake, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import type { Cause, CopyImage, HeaderLink, NavLink } from "@/lib/cms/types";
import { ROUTES } from "@/lib/site";
import { telHref } from "@/lib/utils";

type Props = {
  causes: Pick<Cause, "slug" | "title">[];
  links: (HeaderLink | NavLink)[];
  donateUrl: string;
  phone: string;
  logo: CopyImage;
  text: { donate: string; call: string; open: string; close: string; menu: string; mainNav: string };
};

/**
 * The phone menu, as a native modal <dialog>: the browser keeps focus inside,
 * Escape closes it, the page behind is inert, and it sits in the top layer (so
 * the header's backdrop-filter can't trap it). Closes on any link or Back.
 */
export function MobileNav({ causes, links, donateUrl, phone, logo, text }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => (document.documentElement.style.overflow = "");
    const onBack = () => dialog.open && dialog.close();
    dialog.addEventListener("close", unlock);
    window.addEventListener("popstate", onBack);
    return () => {
      dialog.removeEventListener("close", unlock);
      window.removeEventListener("popstate", onBack);
      unlock();
    };
  }, []);

  const itemClass = "flex min-h-12 items-center font-display text-[1.65rem] text-ink";

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink ring-1 ring-line lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
        <span className="sr-only">{text.open}</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label={text.menu}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-white p-0 backdrop:bg-ink/40 open:flex open:flex-col lg:hidden"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4 sm:px-6">
          <Image
            src={logo.src}
            alt=""
            width={logo.width ?? 1600}
            height={logo.height ?? 500}
            sizes="160px"
            className="h-10 w-auto"
          />
          <button
            type="button"
            autoFocus
            onClick={close}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-ink ring-1 ring-line"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">{text.close}</span>
          </button>
        </div>

        <nav aria-label={text.mainNav} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <ul className="space-y-1">
            {links.map((item, i) => (
              <li key={`${item.href}-${i}`}>
                <Link href={item.href} onClick={close} className={itemClass}>
                  {item.label}
                </Link>
                {"showCauses" in item && item.showCauses ? (
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
          </ul>
        </nav>

        <div className="space-y-3 border-t border-line bg-white px-4 py-4 sm:px-6">
          <a href={donateUrl} className={`${buttonClasses("primary", "lg")} w-full`}>
            <HeartHandshake aria-hidden />
            {text.donate}
          </a>
          <a href={telHref(phone)} className={`${buttonClasses("secondary", "md")} w-full`}>
            <Phone aria-hidden />
            {text.call}
          </a>
        </div>
      </dialog>
    </>
  );
}
