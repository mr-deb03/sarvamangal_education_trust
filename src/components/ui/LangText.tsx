import { Fragment } from "react";

const DEVANAGARI = /([ऀ-ॿ][ऀ-ॿ\s]*[ऀ-ॿ]|[ऀ-ॿ])/;

/**
 * CMS text with any Hindi (Devanagari) words marked `lang="hi"`, so screen
 * readers pronounce them properly — editors type plain text, the markup follows.
 */
export function LangText({ text }: { text: string }) {
  const parts = text.split(DEVANAGARI);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} lang="hi">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
