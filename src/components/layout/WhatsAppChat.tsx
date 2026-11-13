"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { whatsappHref } from "@/lib/utils";

/** WhatsApp's own mark (Simple Icons path), drawn in white on WhatsApp green. */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

const GREETING = "Namaste! I have a question for Sarvamangal Education Trust.";
const BUBBLE_DELAY_MS = 6000;
const DISMISSED_KEY = "sm-whatsapp-bubble-dismissed";
/** How long the bubble stays if nobody touches it. */
const BUBBLE_VISIBLE_MS = 8000;

function rememberDismissed() {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Nothing to remember it in; it simply won't reappear until the next page load.
  }
}

/**
 * Floating WhatsApp button (bottom right) that opens a chat with the trust's
 * WhatsApp number — where the chatbot answers — with a greeting typed in.
 * A small welcome bubble appears once per visit after a few seconds and steps
 * aside on its own — when the visitor scrolls, or after 8 seconds — so it never
 * sits over the page on a phone. On phones the button lifts above the sticky
 * Donate bar while that bar shows (see .whatsapp-fab in globals.css).
 */
export function WhatsAppChat({ number }: { number: string }) {
  const [bubble, setBubble] = useState(false);
  const href = whatsappHref(number, GREETING);

  // Show the bubble once per visit, after a pause.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // Storage blocked (private mode): just show the bubble.
    }
    const timer = window.setTimeout(() => setBubble(true), BUBBLE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // While it's showing: leave when the visitor scrolls on, or after a while.
  useEffect(() => {
    if (!bubble) return;
    const startY = window.scrollY;
    const close = () => {
      setBubble(false);
      rememberDismissed();
    };
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 120) close();
    };
    const timer = window.setTimeout(close, BUBBLE_VISIBLE_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [bubble]);

  function dismiss() {
    setBubble(false);
    rememberDismissed();
  }

  return (
    <div className="whatsapp-fab fixed right-4 z-30 flex flex-col items-end gap-3 print:hidden md:right-6">
      {bubble ? (
        <div className="relative w-[16.5rem] rounded-2xl bg-white p-4 pr-10 text-[0.95rem] leading-snug text-ink-soft shadow-[0_24px_48px_-20px_rgb(23_25_59/0.55)] ring-1 ring-line motion-safe:animate-[bubble-in_300ms_var(--ease-out-soft)]">
          <p>
            <span className="font-semibold text-ink">Namaste!</span> Questions about donating, volunteering or the
            next camp? Ask us on WhatsApp.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="mt-2 inline-flex min-h-11 items-center font-semibold text-crimson underline decoration-crimson/35 underline-offset-4 hover:decoration-crimson"
          >
            Start a chat
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close the WhatsApp message"
            className="absolute top-1 right-1 flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </button>
          {/* Little tail pointing at the button. */}
          <span aria-hidden className="absolute -bottom-1.5 right-6 size-3 rotate-45 bg-white ring-1 ring-line [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
        </div>
      ) : null}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-green group relative flex size-14 items-center justify-center rounded-full text-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.45)] transition-transform duration-200 [--focus-ring:var(--color-ink)] hover:scale-105"
      >
        {/* A soft ring that pings a few times when the page opens. */}
        <span aria-hidden className="whatsapp-green absolute inset-0 rounded-full motion-safe:animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_3]" />
        <svg aria-hidden viewBox="0 0 24 24" className="relative size-7 fill-current">
          <path d={WHATSAPP_PATH} />
        </svg>
      </a>
    </div>
  );
}
