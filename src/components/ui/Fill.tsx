import { Fragment, type ReactNode } from "react";

/**
 * Like `fill()`, but a token can be an element: <Fill template="Donate {amount}" vars={{ amount: <Rupees … /> }} />.
 * For CMS text whose filled-in part needs markup.
 */
export function Fill({ template, vars }: { template: string; vars: Record<string, ReactNode> }) {
  const parts = template.split(/\{(\w+)\}/);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? (vars[part] ?? null) : part}</Fragment>
      ))}
    </>
  );
}
