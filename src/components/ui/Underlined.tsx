import type { CSSProperties } from "react";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Underlines each occurrence of `words` in `text` with the crimson accent
 * underline (`.accent-underline` in globals.css). The line settles in after
 * `delayMs`, or is simply there when the reader prefers reduced motion.
 */
export function Underlined({ text, words, delayMs = 650 }: { text: string; words: string[]; delayMs?: number }) {
  const clean = words.map((w) => w.trim()).filter(Boolean);
  if (clean.length === 0) return <>{text}</>;

  const pattern = new RegExp(`\\b(${clean.map(escapeRegExp).join("|")})\\b`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="accent-underline" style={{ "--underline-delay": `${delayMs}ms` } as CSSProperties}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
