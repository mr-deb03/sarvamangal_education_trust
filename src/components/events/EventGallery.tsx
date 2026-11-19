"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import type { ImageRef, SiteCopy } from "@/lib/cms/types";
import { fill } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Shown before "Show all": two screens of photos on a phone. */
const FIRST = 8;

/**
 * The camp's photos as a contact sheet — every photo uncropped, in columns —
 * and a full-screen viewer: arrow keys or swipe to move, Esc to close. All
 * photos are in the HTML; the ones after the first few wait behind
 * "Show all" (hidden, so they don't load until asked for).
 */
export function EventGallery({
  photos,
  title,
  labels,
}: {
  photos: ImageRef[];
  title: string;
  /** Buttons & labels → Gallery (the CMS). */
  labels: SiteCopy["labels"]["gallery"];
}) {
  const [expanded, setExpanded] = useState(photos.length <= FIRST + 2);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const swipeStart = useRef<number | null>(null);
  const count = photos.length;

  const show = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  function open(i: number, opener: HTMLElement) {
    openerRef.current = opener;
    setIndex(i);
    dialogRef.current?.showModal();
  }

  function onClose() {
    setIndex(null);
    openerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (index === null) return;
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  }

  function onPointerDown(event: PointerEvent) {
    swipeStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent) {
    if (swipeStart.current === null || index === null) return;
    const dx = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
  }

  const at = index ?? 0;
  const current = index !== null ? photos[index] : undefined;
  // The photos either side load in the background, so moving on is instant.
  const neighbours = index !== null && count > 1 ? [photos[(index + 1) % count], photos[(index - 1 + count) % count]] : [];

  return (
    <>
      <ul className="columns-2 gap-2 sm:columns-3 sm:gap-3">
        {photos.map((photo, i) => (
          <li key={photo.src} className={cn("mb-2 break-inside-avoid sm:mb-3", !expanded && i >= FIRST && "hidden")}>
            <button
              type="button"
              onClick={(event) => open(i, event.currentTarget)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-xl bg-paper-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width ?? 1200}
                height={photo.height ?? 900}
                sizes="(min-width: 1280px) 270px, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                quality={70}
                className="h-auto w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {!expanded ? (
        <button type="button" onClick={() => setExpanded(true)} className={cn(buttonClasses("secondary", "md"), "mt-4 w-full sm:w-auto")}>
          <Images aria-hidden />
          {fill(labels.showAll, { n: count })}
        </button>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label={fill(labels.viewer, { title })}
        onClose={onClose}
        onKeyDown={onKeyDown}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-white backdrop:bg-ink"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p aria-live="polite" className="text-sm text-ink-200 tabular-nums">
                {fill(labels.photoOf, { n: at + 1, total: count })}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-marigold"
              >
                <X aria-hidden className="size-6" />
                <span className="sr-only">{labels.close}</span>
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1 touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipeStart.current = null)}
              // A mouse drag would otherwise pick the photo up instead of swiping.
              onDragStart={(event) => event.preventDefault()}
            >
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={80}
                className="object-contain"
              />
              {neighbours.map((photo) =>
                photo && photo.src !== current.src ? (
                  <div key={photo.src} aria-hidden className="invisible absolute inset-0">
                    <Image src={photo.src} alt="" fill sizes="100vw" quality={80} className="object-contain" />
                  </div>
                ) : null,
              )}
            </div>

            <div className="flex items-center justify-center gap-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => show(at - 1)}
                    className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-marigold"
                  >
                    <ChevronLeft aria-hidden className="size-6" />
                    <span className="sr-only">{labels.previous}</span>
                  </button>
                  <p className="max-w-[60vw] truncate text-center text-sm text-ink-200 max-sm:hidden">{title}</p>
                  <button
                    type="button"
                    onClick={() => show(at + 1)}
                    className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-marigold"
                  >
                    <ChevronRight aria-hidden className="size-6" />
                    <span className="sr-only">{labels.next}</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
