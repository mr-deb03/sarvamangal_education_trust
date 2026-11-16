/**
 * Every piece of website text that isn't a record (a camp, cause, FAQ…).
 *
 * This object is the single source of truth for the shape of the site's copy:
 * - the Payload admin fields are generated from it (src/payload/copy/fields.ts),
 *   one global per top-level key (layout, home, pages, labels);
 * - the seed writes it into those globals, so /admin starts with the real text;
 * - any field an editor leaves empty falls back to the value here, and so does
 *   the whole site when no database is configured.
 *
 * Text with `{tokens}` is filled in by the site (see `fill` in src/lib/format.ts).
 * `{ one, other }` pairs are word forms for counts (see `plural`).
 *
 * Adding text: add it here, use it in the component (`copy.home.faq.title`),
 * run `npm run generate:types`, and `npm run seed` to load it into the CMS.
 */

export type NavLink = { label: string; href: string };
export type HeaderLink = NavLink & { showCauses: boolean };
export type Plural = { one: string; other: string };
export type CopyImage = { src: string; alt: string; width?: number; height?: number };

/** Linking an editor-set path: empty → the site's own fallback (e.g. WhatsApp). */
export type OptionalLink = string;

export const defaultCopy = {
  /** Header, footer and everything on every page. Global "site-layout". */
  layout: {
    nav: {
      /**
       * Only pages that exist. /about, /blog, /volunteer, /csr and the policy pages
       * are still to be written — add their links here in /admin when they ship.
       */
      links: [
        { label: "Causes", href: "/causes", showCauses: true },
        { label: "Events", href: "/events", showCauses: false },
      ] as HeaderLink[],
      mobileLinks: [{ label: "Contact", href: "#contact" }] as NavLink[],
      donate: "Donate",
      mobileDonate: "Donate now",
      call: "Call {phone}",
    },
    footer: {
      about:
        "Sarvamangal (सर्वमंगल) means “wellbeing for all”. Since {foundingYear} our volunteers have run free camps for health, education, society and spirituality across Maharashtra.",
      wordmarkTop: "Sarvamangal",
      wordmarkBottom: "Education Trust",
      exploreHeading: "Explore",
      exploreLinks: [
        { label: "Camp register", href: "/events" },
        { label: "Our causes", href: "/causes" },
      ] as NavLink[],
      causesHeading: "Causes",
      contactHeading: "Visit or write",
      registrationLabel: "Public trust reg.",
      panLabel: "PAN",
      eightyGLabel: "80G",
      secureLead: "Secure online donations.",
      secureText: "Payments are processed by Easebuzz.",
      netBanking: "Net banking",
      policyLinks: [] as NavLink[],
      copyright: "© {year} {siteName}. All rights reserved.",
    },
    donateBar: "Donate now · 80G tax benefit",
    whatsapp: {
      greeting: "Namaste! I have a question for Sarvamangal Education Trust.",
      bubbleLead: "Namaste!",
      bubbleText: "Questions about donating, volunteering or the next camp? Ask us on WhatsApp.",
      startChat: "Start a chat",
    },
    skipToContent: "Skip to content",
  },

  /** The homepage, section by section. Global "homepage-sections". */
  home: {
    hero: {
      badges: ["80G tax benefit", "Receipt on email", "Registered public trust"],
      amountLegend: "Choose an amount",
      otherAmount: "Other",
      photosCaption: "Photos from our own camps — {total} on the register since {year}.",
      nextCamp: "Next camp: {day}",
      seeRegister: "See the register",
    },
    comingUp: {
      eyebrow: "Coming up",
      title: { one: "Our next free camp", other: "Our next free camps" } as Plural,
      intro: "Entry is free. Come along, send the details to someone who needs them, or help us run it.",
      alsoComingUp: "Also coming up",
    },
    causes: {
      eyebrow: "Our causes",
      title: "Four ways we show up",
      intro: "One trust, one team of volunteers, four kinds of care. Start with the one closest to your heart.",
    },
    register: {
      eyebrow: "The camp register",
      title: "Written down, camp by camp",
      intro:
        "Since our first exam-anxiety seminar in Bhandup in 2016, we’ve written our camps up here: when each one happened, where, and who it served.",
      browseAll: "Browse all {total} camps",
      dateColumn: "Date",
      campColumn: "Camp · place · people served",
      nextLabel: "Next",
      upcomingCount: "{n} camps coming up",
      seeDetails: "See the details",
      seeDates: "See the dates",
      noDateYet: "Next camp: date being fixed",
      notifyPrompt: "Want to know when it’s announced?",
      notifyCta: "Message us on WhatsApp",
    },
    appeal: {
      eyebrow: "Current appeal",
      raised: "raised",
      towardsGoal: "{counted} towards a {goal} goal",
      soFar: "{counted} so far, and counting",
      goalReached: "Goal reached — thank you!",
      donors: { one: "{n} donor", other: "{n} donors" } as Plural,
      daysLeft: { one: "1 day left", other: "{n} days left" } as Plural,
      lastDay: "Last day today",
      donate: "Donate to this appeal",
      share: "Share on WhatsApp",
      progressLabel: "Progress towards the goal",
    },
    give: {
      eyebrow: "Give",
      title: "Choose what your gift does",
      intro: "Every camp is free for the people who come to it. Our volunteers give their time — your gift pays for the rest.",
      watermark: "सर्वमंगल",
      pickerLegend: "Pick an amount",
      anyAmount: "Any amount",
      taxNote: "Eligible for 80G tax deduction. You’ll finish on our secure donation page and get a receipt by email.",
    },
    voices: {
      eyebrow: "Our supporters",
      title: "Why they keep coming back",
      intro: "Some have stood with us since our very first year.",
      supportersLabel: "With the support of",
      supporterSince: "Supporter since {year}",
    },
    involved: {
      eyebrow: "Get involved",
      title: "Give time, not only money",
      intro: "Every camp runs on people. Here are three ways to be one of them.",
      volunteer: {
        image: {
          src: "/images/blood-donation-camp.jpg",
          alt: "Smiling donors give blood at a Sarvamangal blood donation camp",
          width: 1600,
          height: 1067,
        } as CopyImage,
        eyebrow: "Volunteer",
        title: "Give a morning to a camp",
        text: "Register visitors, hand out notebooks, keep the queue moving. Every extra pair of hands means more people seen.",
        cta: "Become a volunteer",
        /** Empty: opens WhatsApp with the volunteer message below. Set to "/volunteer" once that page exists. */
        link: "" as OptionalLink,
        whatsappMessage: "Hi! I’d like to volunteer at a Sarvamangal camp.",
      },
      csr: {
        title: "Partner with us for CSR",
        text: "Bring a health camp or a notebook drive to the community your company serves. We plan it with your team, run it on the ground, and report back with photos and numbers.",
        cta: "Talk to us about CSR",
        link: "" as OptionalLink,
        whatsappMessage: "Hi! I’d like to talk about a CSR partnership with Sarvamangal Education Trust.",
      },
      notify: {
        title: "Hear about the next camp",
        text: "Send us a WhatsApp message and we’ll tell you when the next camp near you is announced — to come, to help, or to bring someone who needs it.",
        cta: "Message us on WhatsApp",
      },
    },
    faq: {
      eyebrow: "Questions",
      title: "Before you give",
      intro: "What donors and volunteers ask us most. Something else on your mind?",
      writeToUs: "Write to us",
    },
    finalCta: {
      eyebrow: "The next page of the register",
      title: "The next camp is already being planned.",
      text: "A child’s new notebook. An elder’s long-overdue check-up. It starts with someone deciding to help. Help us keep it free.",
      donate: "Donate now",
      volunteer: "Volunteer with us",
      /** Empty: opens WhatsApp with the volunteer message (Get involved → Volunteer). */
      volunteerLink: "" as OptionalLink,
      nextComingUp: "Coming up",
      nextCamp: "Next camp",
      dateBeingFixed: "Date being fixed",
    },
  },

  /** Inner pages. Global "page-text". */
  pages: {
    events: {
      metaTitle: "Camp register: our free camps since {firstYear}",
      metaDescription:
        "Free health camps, blood drives, notebook distribution and seminars run by Sarvamangal Education Trust since {firstYear}, with dates, places and photos.",
      breadcrumb: "Camp register",
      eyebrow: "The camp register",
      title: "Written down, camp by camp",
      intro:
        "Since our first exam-anxiety seminar in Bhandup in 2016, we’ve written our camps up here: when each one happened, where, and who it served.",
      countLine: "{total} camps so far, {firstYear} to today.",
      byCauseLabel: "Camps by cause",
      pastLabel: "Past camps",
      yearCount: { one: "{n} camp", other: "{n} camps" } as Plural,
    },
    event: {
      notFoundTitle: "Camp not found",
      metaTitle: "{title}, {date}",
      metaDescription: "{title} by {siteName} on {date}{place}.",
      dateRange: "{start} to {end}",
      highlightsTitle: "At the camp",
      partnersTitle: "Run together with",
      galleryTitle: "Photos from the camp",
      helpLabel: "Help",
      helpEyebrow: "Keep the next one free",
      helpText: "Every camp like this is free for the people who come. Your gift pays for the next one.",
      helpDonate: "Donate",
      helpNote: "80G tax benefit · receipt by email",
      share: "Share this camp on WhatsApp",
      moreLabel: "More camps",
      moreInCause: "More {cause} camps",
      allInCause: "All {cause} camps",
      newer: "Newer camp",
      older: "Older camp",
      wholeRegister: "The whole camp register",
    },
    causes: {
      metaTitle: "Our causes: health, education, society and spirituality",
      metaDescription:
        "The four kinds of free camps Sarvamangal Education Trust runs in Maharashtra: health, education, cleaner neighbourhoods and spirituality.",
      breadcrumb: "Our causes",
    },
    cause: {
      notFoundTitle: "Cause not found",
      metaTitle: "{cause}: {tagline}",
      campCount: { one: "{n} camp on the register", other: "{n} camps on the register" } as Plural,
      since: " since {year}",
      comingUp: " · {n} coming up",
      give: "Give to {cause} camps",
      seeCamps: "See the camps",
      campsTitle: "{cause} camps on the register",
      othersLabel: "Other causes",
      othersTitle: "Our other causes",
    },
    notFound: {
      metaTitle: "Page not found",
      eyebrow: "Page not found",
      title: "We couldn’t find that page.",
      text: "It may have moved when we rebuilt the website, or it is still being written. Start from the home page, or support the next camp while you are here.",
      home: "Back to home",
      donate: "Donate now",
    },
  },

  /** Short labels used in many places. Global "labels". */
  labels: {
    common: {
      home: "Home",
      donateAmount: "Donate {amount}",
      donateNow: "Donate now",
    },
    camp: {
      directions: "Directions",
      addToCalendar: "Add to calendar",
      sendOnWhatsapp: "Send on WhatsApp",
      highlights: "At the camp",
      helpFund: "Help fund this camp",
      volunteer: "Volunteer at this camp",
      shareLead: "Know someone who should come?",
      shareCta: "Send them the details on WhatsApp",
      entryFree: "Entry free",
      endsOn: "to {date}",
      campCount: { one: "{n} camp", other: "{n} camps" } as Plural,
      onRegister: " on the register",
      seeCause: "See {cause}",
      countdownDays: "In {n} days",
      countdownTomorrow: "Tomorrow",
      countdownToday: "Today",
      countdownOnNow: "On now",
    },
    ticker: {
      live: "Live",
      updated: "· updated {date}",
      latestCamp: "Latest camp: {title}, {date}",
      campsSince: "camps on the register since {year}",
      campsTotal: "camps on the register",
    },
    messages: {
      notifyNextCamp: "Hi! Please let me know when the next Sarvamangal camp is announced.",
      volunteerAtCamp: "Hi! I’d like to volunteer at {title} on {day}.",
      shareCamp: "{title} — {when}, at {place}. Entry is free. Organised by {siteName}.",
      shareAppeal: "{title} — {siteName}.",
      calendarDetails: "Organised by {siteName}. Entry is free.",
      calendarTime: "Time: {time}",
    },
    /** Read aloud by screen readers. Keep them short and plain. */
    accessibility: {
      homeLink: "{siteName} — home",
      mainNav: "Main",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menu: "Menu",
      breadcrumb: "Breadcrumb",
      liveUpdates: "Live updates",
      causes: "Causes",
      explore: "Explore",
      footerCauses: "Causes",
      waysToPay: "Ways to pay",
      social: "{shortName} on {platform}",
      whatsappButton: "Chat with us on WhatsApp",
      whatsappClose: "Close the WhatsApp message",
    },
  },
};

export type SiteCopy = typeof defaultCopy;

/** Payload global slug for each top-level part of the copy. */
export const COPY_GLOBALS = {
  layout: "site-layout",
  home: "homepage-sections",
  pages: "page-text",
  labels: "labels",
} as const satisfies Record<keyof SiteCopy, string>;

/** The organisation itself (Site settings → Identity & SEO, admins only). */
export const defaultIdentity = {
  siteName: "Sarvamangal Education Trust",
  shortName: "Sarvamangal",
  homeTitle: "Sarvamangal Education Trust — Mumbai NGO for health & education",
  // Kept under ~160 characters so Google shows it whole.
  description:
    "Mumbai charitable trust running free medical camps, blood drives, notebook distribution and career guidance since 2015. Donate with 80G tax benefit.",
  // Both names appear on the trust's own camp banners.
  alternateNames: ["Sarvamangal Foundation", "SMET"],
  foundingYear: "2015",
  twitterHandle: "@sarvamangalorg",
  logo: { src: "/brand/sarvamangal-logo.png", alt: "", width: 1600, height: 500 } as CopyImage,
  mark: { src: "/brand/sarvamangal-mark.png", alt: "", width: 458, height: 458 } as CopyImage,
  shareImage: {
    src: "/images/og-default.jpg",
    alt: "Children at a Sarvamangal Education Trust notebook distribution hold up their new notebooks",
    width: 1200,
    height: 630,
  } as CopyImage,
  areaServed: ["Mumbai", "Maharashtra"],
  knowsAbout: [
    "Free medical camps",
    "Blood donation drives",
    "Notebook distribution for schoolchildren",
    "Career guidance",
    "Exam anxiety counselling",
    "Yoga and meditation",
  ],
};

export type Identity = typeof defaultIdentity;
