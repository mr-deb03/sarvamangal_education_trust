import {
  ArrowUpRight,
  CalendarCheck,
  CalendarPlus,
  FilePenLine,
  HeartHandshake,
  Images,
  IndianRupee,
  Layers,
  Radio,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Payload } from "payload";

import { formatDate, indiaDate } from "@/lib/format";

import { isAdmin } from "../access";

type Props = {
  payload: Payload;
  user?: { name?: string | null; email?: string; role?: string | null } | null;
};

type EventDoc = {
  id: number | string;
  title: string;
  startDate: string;
  locality?: string | null;
  city?: string | null;
  beneficiaries?: { count?: number | null; label?: string | null } | null;
};

/** "Sun, 22 Nov 2026" from a stored timestamp, in India's calendar. */
const day = (iso: string) => {
  const date = indiaDate(new Date(iso));
  return `${formatDate(date, { weekday: "short" })}, ${formatDate(date)}`;
};

/**
 * The admin home: the trust's everyday jobs as one-click actions, and what's on
 * the website right now. Rendered above Payload's own section cards.
 * The admin renders per request, so reading the clock here is fine.
 */
export async function TaskDashboard({ payload, user }: Props) {
  const admin = payload.config.routes.admin;
  const today = indiaDate(new Date());
  const startOfToday = new Date(`${today}T00:00:00+05:30`).toISOString();
  const published = { _status: { equals: "published" } } as const;

  const [next, latest, drafts, live, appeal, photos] = await Promise.all([
    payload.find({
      collection: "events",
      where: { and: [published, { startDate: { greater_than_equal: startOfToday } }] },
      sort: "startDate",
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: "events",
      where: { and: [published, { startDate: { less_than: startOfToday } }] },
      sort: "-startDate",
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: "events",
      where: { _status: { equals: "draft" } },
      draft: true,
      sort: "-updatedAt",
      limit: 4,
      depth: 0,
    }),
    payload.findGlobal({ slug: "live-updates", depth: 0 }),
    payload.findGlobal({ slug: "fundraising-appeal", depth: 0 }),
    payload.count({ collection: "media" }),
  ]);

  const nextCamp = next.docs[0] as EventDoc | undefined;
  const latestCamp = latest.docs[0] as EventDoc | undefined;
  const totals = (live.counters ?? [])
    .map((c) => `${c.value.toLocaleString("en-IN")}${c.plus ? "+" : ""} ${c.label}`)
    .join(" · ");
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const showAdmin = isAdmin(user);

  return (
    <section className="sm-dash" aria-labelledby="sm-dash-title">
      <header className="sm-dash__head">
        <div>
          <p className="sm-dash__eyebrow">Sarvamangal admin</p>
          <h1 id="sm-dash-title" className="sm-dash__title">
            Namaste{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="sm-dash__lead">Whatever you save here shows on the website straight away.</p>
        </div>
        <a className="sm-dash__site" href="/" target="_blank" rel="noopener noreferrer">
          View the website
          <ArrowUpRight aria-hidden size={16} />
        </a>
      </header>

      <h2 className="sm-dash__h2">Quick actions</h2>
      <ul className="sm-dash__actions">
        <Action
          href={`${admin}/collections/events/create`}
          icon={CalendarPlus}
          title="Add a camp"
          text="Date, place, photo and what’s at the camp. Future dates appear in “Coming up”."
          primary
        />
        <Action
          href={`${admin}/globals/live-updates`}
          icon={Radio}
          title="Update the live ticker"
          text={totals ? `Now showing: ${totals}.` : "No totals yet. Add one, e.g. “1,500+ pouches given to students”."}
        />
        <Action
          href={`${admin}/globals/fundraising-appeal`}
          icon={HeartHandshake}
          title={appeal.enabled ? "Update the appeal" : "Start an appeal"}
          text={
            appeal.enabled && appeal.title
              ? `On the homepage now: “${appeal.title}”.`
              : "Off. Switch it on when there’s a goal to show, with a progress bar."
          }
        />
        <Action
          href={`${admin}/collections/media/create`}
          icon={Images}
          title="Upload photos"
          text={`${photos.totalDocs.toLocaleString("en-IN")} photos and logos in the library.`}
        />
      </ul>

      <h2 className="sm-dash__h2">On the website now</h2>
      <div className="sm-dash__glance">
        <article className="sm-dash__panel">
          <p className="sm-dash__label">
            <CalendarCheck aria-hidden size={16} /> Next camp
          </p>
          {nextCamp ? (
            <>
              <p className="sm-dash__big">{nextCamp.title}</p>
              <p className="sm-dash__meta">
                {day(nextCamp.startDate)}
                {nextCamp.locality || nextCamp.city ? ` · ${nextCamp.locality ?? nextCamp.city}` : ""}
              </p>
              <Link className="sm-dash__link" href={`${admin}/collections/events/${nextCamp.id}`}>
                Edit this camp
              </Link>
            </>
          ) : (
            <>
              <p className="sm-dash__big">Nothing scheduled</p>
              <p className="sm-dash__meta">The homepage says “Next camp: date being fixed”.</p>
              <Link className="sm-dash__link" href={`${admin}/collections/events/create`}>
                Add the next camp
              </Link>
            </>
          )}
        </article>

        <article className="sm-dash__panel">
          <p className="sm-dash__label">
            <Layers aria-hidden size={16} /> Latest camp
          </p>
          {latestCamp ? (
            <>
              <p className="sm-dash__big">{latestCamp.title}</p>
              <p className="sm-dash__meta">
                {day(latestCamp.startDate)}
                {latestCamp.beneficiaries?.count
                  ? ` · ${latestCamp.beneficiaries.count.toLocaleString("en-IN")} ${latestCamp.beneficiaries.label ?? "people"}`
                  : ""}
              </p>
              <Link className="sm-dash__link" href={`${admin}/collections/events/${latestCamp.id}`}>
                Add photos or numbers
              </Link>
            </>
          ) : (
            <p className="sm-dash__meta">No camps on the register yet.</p>
          )}
        </article>

        <article className="sm-dash__panel">
          <p className="sm-dash__label">
            <FilePenLine aria-hidden size={16} /> Drafts
          </p>
          {drafts.totalDocs > 0 ? (
            <>
              <p className="sm-dash__big">
                {drafts.totalDocs} waiting to publish
              </p>
              <ul className="sm-dash__drafts">
                {(drafts.docs as EventDoc[]).map((d) => (
                  <li key={d.id}>
                    <Link href={`${admin}/collections/events/${d.id}`}>{d.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="sm-dash__big">None</p>
              <p className="sm-dash__meta">
                Use “Save draft” to prepare a camp; it stays off the website until you press “Publish”.
              </p>
            </>
          )}
        </article>
      </div>

      {showAdmin ? (
        <>
          <h2 className="sm-dash__h2">For admins</h2>
          <ul className="sm-dash__admin">
            <AdminLink href={`${admin}/globals/site-settings`} icon={Settings} label="Site settings" />
            <AdminLink href={`${admin}/collections/donation-tiers`} icon={IndianRupee} label="Donation amounts" />
            <AdminLink href={`${admin}/collections/causes`} icon={Layers} label="Causes" />
            <AdminLink href={`${admin}/collections/users`} icon={UsersRound} label="Team members" />
          </ul>
        </>
      ) : null}

      <h2 className="sm-dash__h2 sm-dash__h2--all">All sections</h2>
    </section>
  );
}

function Action({
  href,
  icon: Icon,
  title,
  text,
  primary = false,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
  primary?: boolean;
}) {
  return (
    <li>
      <Link className={`sm-dash__action${primary ? " sm-dash__action--primary" : ""}`} href={href}>
        <span className="sm-dash__icon">
          <Icon aria-hidden size={20} />
        </span>
        <span className="sm-dash__action-title">{title}</span>
        <span className="sm-dash__action-text">{text}</span>
      </Link>
    </li>
  );
}

function AdminLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <li>
      <Link className="sm-dash__admin-link" href={href}>
        <Icon aria-hidden size={16} />
        {label}
      </Link>
    </li>
  );
}
