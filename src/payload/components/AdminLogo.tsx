import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Payload } from "payload";

import { defaultIdentity } from "@/lib/cms/copy/defaults";

/**
 * The trust's logo in the admin: the round mark plus the name as live text (the
 * logo PNG's black lettering would vanish in dark mode). The name comes from
 * Site settings → Identity, falling back to the built-in one.
 */
async function trustName(payload?: Payload) {
  let siteName = defaultIdentity.siteName;
  let shortName = defaultIdentity.shortName;
  try {
    const settings = payload ? await payload.findGlobal({ slug: "site-settings", depth: 0 }) : null;
    siteName = settings?.identity?.siteName?.trim() || siteName;
    shortName = settings?.identity?.shortName?.trim() || shortName;
  } catch {
    // Before the first migration the global may not exist yet — keep the built-in name.
  }
  // "Sarvamangal Education Trust" → "Sarvamangal" over "Education Trust".
  const rest = siteName.toLowerCase().startsWith(shortName.toLowerCase()) ? siteName.slice(shortName.length).trim() : "";
  return { siteName, shortName, rest };
}

function Mark({ size, preload = false }: { size: number; preload?: boolean }) {
  return (
    <Image
      src="/brand/sarvamangal-mark.png"
      alt=""
      width={458}
      height={458}
      preload={preload}
      sizes={`${size}px`}
      className="sm-brand__mark"
      style={{ width: size, height: size }}
    />
  );
}

/** Sign-in and password screens (admin.components.graphics.Logo): the full lockup, large. */
export async function AdminLogo({ payload }: { payload?: Payload }) {
  const { shortName, rest } = await trustName(payload);
  return (
    <div className="sm-brand sm-brand--large">
      <Mark size={72} preload />
      <div className="sm-brand__words">
        <strong className="sm-brand__name">{shortName}</strong>
        {rest ? <small className="sm-brand__sub">{rest}</small> : null}
      </div>
    </div>
  );
}

/** Top-left of every admin page, linking to the dashboard (admin.components.graphics.Icon). */
export async function AdminIcon({ payload }: { payload?: Payload }) {
  const { shortName } = await trustName(payload);
  return (
    <div className="sm-brand sm-brand--header">
      <Mark size={32} />
      <div className="sm-brand__words">
        <strong className="sm-brand__name">{shortName}</strong>
        <small className="sm-brand__tag">Admin</small>
      </div>
    </div>
  );
}

/** Top of the side menu (admin.components.beforeNavLinks): the lockup and a way to the live site. */
export async function NavBrand({ payload }: { payload?: Payload }) {
  const { shortName, rest } = await trustName(payload);
  return (
    <div className="sm-nav-brand">
      <div className="sm-brand">
        <Mark size={40} />
        <div className="sm-brand__words">
          <strong className="sm-brand__name">{shortName}</strong>
          {rest ? <small className="sm-brand__sub">{rest}</small> : null}
        </div>
      </div>
      <a className="sm-nav-brand__site" href="/" target="_blank" rel="noopener noreferrer">
        View the website
        <ArrowUpRight aria-hidden size={15} />
      </a>
    </div>
  );
}
