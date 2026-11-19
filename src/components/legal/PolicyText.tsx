import { Fragment, type ReactNode } from "react";

import { Fill } from "@/components/ui/Fill";

type Block = { type: "p"; lines: string[] } | { type: "ul"; items: string[] };

/**
 * Plain text from the CMS → paragraphs and lists. A blank line starts a new
 * paragraph, a line starting "- " is a bullet point, a single line break stays a
 * line break (an address), and **double stars** make words bold.
 */
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      current = null;
      continue;
    }
    const bullet = /^[-•]\s+/.exec(line);
    if (bullet) {
      if (current?.type !== "ul") {
        current = { type: "ul", items: [] };
        blocks.push(current);
      }
      current.items.push(line.slice(bullet[0].length));
    } else {
      if (current?.type !== "p") {
        current = { type: "p", lines: [] };
        blocks.push(current);
      }
      current.lines.push(line);
    }
  }
  return blocks;
}

/** One line: **bold** runs, with {tokens} filled in (a token can be a link). */
function Inline({ text, vars }: { text: string; vars: Record<string, ReactNode> }) {
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i}>
            <Fill template={part} vars={vars} />
          </strong>
        ) : (
          <Fill key={i} template={part} vars={vars} />
        ),
      )}
    </>
  );
}

export function PolicyText({ text, vars }: { text: string; vars: Record<string, ReactNode> }) {
  return (
    <>
      {parse(text).map((block, i) =>
        block.type === "ul" ? (
          <ul key={i}>
            {block.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} vars={vars} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                <Inline text={line} vars={vars} />
              </Fragment>
            ))}
          </p>
        ),
      )}
    </>
  );
}
