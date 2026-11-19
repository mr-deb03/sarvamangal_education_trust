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
      /** Only pages that exist (/blog is still to be written — add it here when it ships). */
      links: [
        { label: "About", href: "/about", showCauses: false },
        { label: "Causes", href: "/causes", showCauses: true },
        { label: "Events", href: "/events", showCauses: false },
        { label: "Volunteer", href: "/volunteer", showCauses: false },
        { label: "CSR", href: "/csr", showCauses: false },
      ] as HeaderLink[],
      mobileLinks: [{ label: "Contact", href: "/contact" }] as NavLink[],
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
        { label: "About us", href: "/about" },
        { label: "Camp register", href: "/events" },
        { label: "Our causes", href: "/causes" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "CSR partnerships", href: "/csr" },
        { label: "Contact", href: "/contact" },
      ] as NavLink[],
      causesHeading: "Causes",
      contactHeading: "Visit or write",
      registrationLabel: "Public trust reg.",
      panLabel: "PAN",
      eightyGLabel: "80G",
      secureLead: "Secure online donations.",
      // Owner's rule (Nov 2026): no NRI or foreign donations.
      secureText:
        "Payments are processed by Easebuzz. We can only accept donations from Indian citizens living in India — not from NRIs or from abroad.",
      netBanking: "Net banking",
      policyLinks: [
        { label: "Privacy policy", href: "/privacy-policy" },
        { label: "Terms & conditions", href: "/terms" },
      ] as NavLink[],
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
      /** Under the Donate button. Owner's rule (Nov 2026): no NRI or foreign donations. */
      citizensOnly: "For Indian citizens living in India only.",
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
      taxNote:
        "Eligible for 80G tax deduction. Open to Indian citizens living in India only — we can’t accept donations from NRIs or from abroad. You’ll finish on our secure donation page and get a receipt by email.",
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
        /** Empty: opens WhatsApp with the volunteer message below instead. */
        link: "/volunteer" as OptionalLink,
        whatsappMessage: "Hi! I’d like to volunteer at a Sarvamangal camp.",
      },
      csr: {
        title: "Partner with us for CSR",
        text: "Bring a health camp or a notebook drive to the community your company serves. We plan it with your team, run it on the ground, and report back with photos and numbers.",
        cta: "Talk to us about CSR",
        /** Empty: opens WhatsApp with the CSR message below instead. */
        link: "/csr" as OptionalLink,
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
      volunteerLink: "/volunteer" as OptionalLink,
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
      helpNote: "80G tax benefit · receipt by email · Indian citizens living in India only",
      share: "Share this camp on WhatsApp",
      seeAllPhotos: { one: "See the photo", other: "See all {n} photos" } as Plural,
      photoCount: { one: "{n} photo · tap to enlarge", other: "{n} photos · tap to enlarge" } as Plural,
      detailsLabel: "Camp details and how to help",
      detailsTitle: "Camp details",
      when: "When",
      where: "Where",
      directions: "Get directions",
      causeLabel: "Cause",
      peopleServed: "People served",
      expected: "Expected",
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
    about: {
      metaTitle: "About us",
      metaDescription:
        "{siteName} is a Mumbai public charitable trust, set up in {foundingYear}, running free camps for health, education, society and spirituality.",
      breadcrumb: "About us",
      eyebrow: "About us",
      title: "Wellbeing for all, since {foundingYear}",
      intro: "{siteName} is a Mumbai public charitable trust committed to lasting, positive change in the lives of the people most in need.",
      image: {
        src: "/images/sarvamangal-free-health-checkup-camp-bhandup.jpg",
        alt: "Doctors see patients under the Sarvamangal Education Trust banner at a free health check-up camp in Bhandup West",
        width: 1280,
        height: 853,
      } as CopyImage,
      imageCaption: "Free health check-up camp with Nidan Clinic, Bhandup West, 8 June 2025",
      name: {
        hindi: "सर्वमंगल",
        meaning: "Sarvamangal means “wellbeing for all”.",
      },
      believe: {
        eyebrow: "What we believe",
        title: "Compassion, equity and opportunity",
        text: "We were set up in {foundingYear} with that vision, and we work across communities to support education, healthcare, society and spiritual growth. Our volunteers run free health camps, blood drives, notebook distributions, coding classes and career seminars across Maharashtra.",
        quote: "We believe in the power of synergy — where every act of kindness turns into a chain reaction of positivity.",
        closing:
          "Everything we run is free for the people who come. It is paid for by our donors and supporters, and run by our volunteers.",
      },
      numbers: {
        title: "Our work in numbers",
        registerStat: "camps you can read about in our online register",
      },
      accountable: {
        eyebrow: "Registered and accountable",
        title: "A registered trust, on the record",
        text: "We are a registered public charitable trust. Every donation gets a receipt with our registration and 80G details, sent by email. Our camps are written up in a public register — when, where and who they served — and donors can ask us for a report on how their gifts were used.",
        cta: "See the camp register",
      },
    },
    volunteer: {
      metaTitle: "Volunteer with us in Mumbai",
      metaDescription:
        "Give a morning to a free health camp, notebook drive or clean-up in Mumbai. Fill in the volunteer form and {siteName} will call you.",
      breadcrumb: "Volunteer",
      eyebrow: "Volunteer",
      title: "Give a morning to a camp",
      intro: "Society united, progress amplified. Every camp we run needs people — every extra pair of hands means more people seen.",
      image: {
        src: "/images/world-environment-day-volunteers.jpg",
        alt: "Young volunteers wearing Sarvamangal lanyards collect waste from shops on World Environment Day",
        width: 1800,
        height: 1351,
      } as CopyImage,
      rolesTitle: "What volunteers do",
      roles: [
        {
          title: "At health camps and blood drives",
          text: "Register visitors and keep the queue moving, so the doctors can see more people.",
        },
        { title: "At notebook drives", text: "Hand out notebooks and stationery to the children who come." },
        { title: "On days of service", text: "Clean-ups, tree planting and yoga days in the neighbourhood." },
      ],
      formTitle: "Volunteer form",
      formIntro:
        "Tell us a little about yourself. What you study or do for a living helps us find the right role for you at a camp.",
      stepsTitle: "What happens next",
      steps: [
        "Send us the form. It takes a few minutes.",
        "Someone from the trust calls you about the camps coming up.",
        "You join a camp near you.",
      ],
      trainingEyebrow: "Trained together",
      /** The camp shown under "Trained together": the end of its web address, after /events/. Empty hides the card. */
      trainingCamp: "prarambh-2",
      trainingCta: "Read about the camp",
    },
    csr: {
      metaTitle: "CSR partnerships",
      metaDescription:
        "Partner with {siteName} for CSR: adopt a health camp or notebook drive in Mumbai, set up payroll giving, or bring your team to volunteer.",
      breadcrumb: "CSR partnerships",
      eyebrow: "CSR partnerships",
      title: "Partner with us for CSR",
      intro:
        "Bring a health camp or a notebook drive to the community your company serves. We plan it with your team, run it on the ground, and report back with photos and numbers.",
      registerCta: "Register your interest",
      call: "Call {phone}",
      why: {
        eyebrow: "Why partner with an NGO",
        title: "Your reach, our groundwork",
        paragraphs: [
          "More and more companies in India are building CSR into the way they work. Partnerships between companies and non-profits help both sides: companies gain from an NGO’s groundwork and knowledge of the community, and NGOs gain steady funding and support — so social problems can be tackled together, at scale.",
          "Done well, CSR also strengthens how people see your brand, helps you attract investment and good people, and builds engagement among your staff and loyalty among your customers.",
        ],
      },
      ways: {
        eyebrow: "Ways to partner with us",
        title: "Pick what matters to your company",
        adoptEyebrow: "Adopt a project",
        adoptTitle: "Fund a whole camp, or part of one",
        adoptText:
          "Support an entire project or just a portion of it, in the area you care about. Our work spans issues and places, so you can pick what is important to you.",
        adoptCount: { one: "{n} camp in the register", other: "{n} camps in the register" } as Plural,
        payrollTitle: "Payroll giving",
        payrollText:
          "Your employees give a set amount from their monthly salary — a simple way for them to feel connected to the cause your company has taken on.",
        teamTitle: "Bring your team",
        teamText: "CSR is a great way to get your staff involved too: they can volunteer at the camp your company funds.",
      },
      facts: {
        title: "For your CSR team",
        text: "A registered public charitable trust in Mumbai, working since {foundingYear}. If your process needs other documents, ask us.",
      },
      form: {
        eyebrow: "CSR registration",
        title: "Let’s plan it together",
        text: "Leave your details and someone from the trust will get in touch to talk it through.",
      },
    },
    contact: {
      metaTitle: "Contact us",
      metaDescription:
        "Call, WhatsApp or write to {siteName} in Bhandup West, Mumbai — about a camp, a donation receipt, volunteering or CSR.",
      breadcrumb: "Contact",
      eyebrow: "Contact us",
      title: "Talk to us",
      intro:
        "A question about a camp, a donation receipt, volunteering or a CSR partnership? Call, send a WhatsApp message or write to us.",
      callLabel: "Call",
      whatsappLabel: "WhatsApp",
      whatsappCta: "Send us a message",
      emailLabel: "Email",
      officeLabel: "Office",
      directions: "Get directions",
      directionsLabel: "Directions to {address} (opens Google Maps)",
      formTitle: "Send us a message",
      formIntro:
        "Leave a phone number or an email and we’ll get back to you. For a donation receipt, include the date and amount of your gift.",
      /** The page's name for search engines (schema.org ContactPage). */
      schemaName: "Contact {siteName}",
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

  /**
   * The privacy policy and terms — the trust's own text from the old site (Nov 2025),
   * updated Nov 2026 for the new forms and the Indian-citizens-only rule. Global "policy-text".
   * In a section's text: a blank line starts a new paragraph, a line starting "- " is a
   * bullet point, **double stars** make words bold. {email}, {phone}, {address} and {siteName}
   * come from Site settings; {termsLink} and {privacyLink} become links to the other policy.
   */
  policies: {
    privacy: {
      metaTitle: "Privacy policy",
      metaDescription:
        "How {siteName} collects, uses and protects the details of donors, volunteers and visitors, under India's IT Act and DPDP Act 2023.",
      breadcrumb: "Privacy policy",
      eyebrow: "Policies",
      title: "Privacy policy",
      intro:
        "{siteName} is committed to protecting the privacy of donors, volunteers, beneficiaries and visitors. This policy explains how we collect, use, store and protect your personal information.",
      updated: "November 2026",
      /** How other pages link here, e.g. "Please also read our privacy policy". */
      linkText: "privacy policy",
      /** The number the old policy gives for privacy requests ({rightsPhone}). */
      rightsPhone: "+91 97022 46277",
      sections: [
        {
          title: "Information we collect",
          body: "We may collect the following when you use our website or support our work:\n- Full name\n- Email address\n- Phone number\n- Residential or postal address and PIN code\n- PAN or Aadhaar number (for donations and statutory compliance)\n- Payment and transaction details\n- For volunteers: date of birth, occupation, education and profession, and who referred you (from the volunteer form)\n- For companies: your company’s name and address (from the CSR form)\n- Browser and device information collected automatically through Google Analytics\n\nWe do not store any biometric or financial card information.",
        },
        {
          title: "How we use your data",
          body: "We use your information only for lawful, charitable purposes:\n- Processing donations and issuing receipts, including 80G certificates\n- Replying to volunteer sign-ups, CSR enquiries and messages sent through our forms\n- Contacting donors and volunteers about our camps and their impact\n- Sharing updates and newsletters about our work\n- Accounting, legal compliance and donor verification\n- Improving the website’s performance and your experience of it\n\nWe do not sell, trade or share your personal data for commercial purposes.",
        },
        {
          title: "Third-party services",
          body: "We share information only with trusted service providers, and only what they need:\n- **Easebuzz** — to process secure online donations\n- **Google Analytics** — to understand and improve how the website performs\n\nThese services follow their own privacy and security standards.",
        },
        {
          title: "Legal compliance",
          body: "We comply with:\n- the Information Technology Act, 2000 (India)\n- the Digital Personal Data Protection Act (DPDP), 2023\n\nDocuments donors submit for tax benefits are kept strictly for legal requirements, in secure records.",
        },
        {
          title: "Data security",
          body: "We take administrative, digital and physical measures to protect your information from:\n- unauthorised access\n- alteration\n- disclosure\n- misuse or loss\n\nAll payments are encrypted by the Easebuzz payment gateway.",
        },
        {
          title: "Your rights",
          body: "You have the right to:\n- ask us to correct information that is wrong or out of date\n- ask how your data is used\n\nWrite to us at {email} or call {rightsPhone}. For your safety, we may need to verify your identity before acting on a request.",
        },
        {
          title: "Data retention",
          body: "We keep personal data only as long as it is:\n- required by law (including Income Tax Department compliance), or\n- needed for our charitable work and record-keeping.\n\nData we no longer need is securely archived or deleted.",
        },
        {
          title: "External links",
          body: "Our website links to other platforms, such as our donation page, WhatsApp and social media. We are not responsible for the privacy practices of external websites.",
        },
        {
          title: "Consent",
          body: "By using our website or sending us your information, you agree to this privacy policy. Please also read our {termsLink}.",
        },
        {
          title: "Updates to this policy",
          body: "We may update this policy from time to time to comply with the law and stay transparent. Changes will be posted on this page with the date they were made.",
        },
        {
          title: "Contact and grievances",
          body: "For questions or concerns about your privacy, contact:\n\n**{siteName}**\n{address}, India\nPhone: {phone}\nEmail: {email}",
        },
        {
          title: "Our commitment",
          body: "We value every donor and supporter who believes in our work. Your trust lets us keep serving children, young people and communities through education, health and social care.",
        },
      ],
    },
    terms: {
      metaTitle: "Terms & conditions",
      metaDescription:
        "The terms for using the {siteName} website and donating online: payments, receipts, who can donate and how donations are used.",
      breadcrumb: "Terms & conditions",
      eyebrow: "Policies",
      title: "Terms & conditions",
      intro:
        "These terms cover your use of {domain} and taking part in our charitable work, including donating online. By using the website, you agree to them.",
      updated: "November 2026",
      linkText: "terms & conditions",
      sections: [
        {
          title: "About us",
          body: "{siteName} is a registered public charitable trust working for education, health, social welfare and spiritual causes, for the good of the public.\n\nRegistered address: {address}, India.",
        },
        {
          title: "Use of our website",
          body: "You agree to use the website only for legitimate, non-commercial purposes and to support charitable work.\n\nYou must not:\n- access or misuse the website’s features without permission\n- publish harmful or misleading information\n- try to disrupt the website’s security or operation",
        },
        {
          // Its link (#donations-and-payments) is where the old refund-policy URL lands.
          title: "Donations & payments",
          body: "- **Who can donate:** we accept online donations only from Indian citizens living in India. We can’t accept donations from NRIs or from outside India.\n- All online donations are processed securely through the Easebuzz payment gateway.\n- Receipts, including 80G certificates where applicable, are issued once we have valid donor details.\n- Donations are final and non-refundable, except for duplicate transactions or technical errors (subject to verification).",
        },
        {
          title: "Use of donations",
          body: "Funds are used strictly for charitable purposes in line with our mission, including:\n- child education and tuition support\n- notebook and stationery distribution\n- career development programmes\n- health camps and public welfare activities\n\nWe may share transparency reports with donors on request or in our official updates.",
        },
        {
          title: "Intellectual property",
          body: "All content on this website — logos, text, graphics and images — belongs to {siteName} unless stated otherwise. You must not:\n- republish the website’s content without permission\n- use the trust’s name or logo for personal or commercial purposes",
        },
        {
          title: "Third-party links",
          body: "Our website links to outside services for donations, analytics and information. We are not responsible for the content or practices of other websites.",
        },
        {
          title: "Data protection & privacy",
          body: "When you use our website or donate online, we may collect and use your personal data as described in our {privacyLink}. By continuing to use this website, you agree to it.",
        },
        {
          title: "Liability & disclaimer",
          body: "We work to keep the website accurate and secure, but:\n- we do not guarantee that it will always be available\n- we are not liable for losses caused by technical failures, internet problems or unauthorised access\n\nAll services are provided “as is” and “as available”.",
        },
        {
          title: "Your responsibility",
          body: "Please make sure the details you give us are accurate, especially for:\n- donation receipts\n- tax documents\n- contacting you\n\nIf information turns out to be false, we may be unable to provide a receipt or service.",
        },
        {
          title: "Changes to these terms",
          body: "We may change these terms at any time. Changes will be posted on this page with the date they were made. Using {domain} after a change means you accept the updated terms.",
        },
        {
          title: "Contact",
          body: "For questions, concerns or feedback, email {email} or call {phone}.",
        },
        {
          title: "Our commitment",
          body: "Thank you for supporting our work with children and communities through education, health and social care. Your trust and your gifts help build a better tomorrow.",
        },
      ],
    },
  },

  /**
   * The volunteer, CSR and contact forms: labels, hints, the messages shown when
   * something needs fixing, and the thank-you notes. Global "form-text".
   */
  forms: {
    common: {
      requiredMark: "*",
      optional: "(optional)",
      choose: "Choose…",
      phonePlaceholder: "98200 12345",
      sending: "Sending…",
      fixErrors: "Please fix the fields marked above.",
      unavailable: "We couldn’t send this from the website just now.",
      unavailableCta: "Send it to us on WhatsApp instead",
      orWhatsapp: "Or message us on WhatsApp",
      privacyNote: "We use these details only to get back to you. See our {privacyLink}.",
      thanksTitle: "Thank you — we’ve got it.",
      /** A hidden field that catches spam bots; only screen readers in odd setups ever meet it. */
      spamTrap: "Leave this empty",
    },
    errors: {
      name: "Enter your name.",
      phone: "Enter a 10-digit mobile number, like 98200 12345.",
      phoneMissing: "Enter your mobile number so we can call you.",
      email: "Enter an email address like name@example.com.",
      workEmail: "Enter your work email.",
      pincode: "Enter a 6-digit PIN code.",
      date: "Enter a valid date.",
      company: "Enter your company’s name.",
      address: "Enter your company’s address.",
      phoneOrEmail: "Enter a phone number or an email address so we can reply.",
      message: "Write your message.",
    },
    volunteer: {
      submit: "Send my details",
      thanks: "Someone from the trust will get in touch about the next camp you can help at.",
      whatsappMessage: "Hi! I’d like to volunteer with Sarvamangal Education Trust.",
      name: "Full name",
      phone: "Mobile number",
      email: "Email",
      dateOfBirth: "Date of birth",
      address: "Home address",
      pincode: "PIN code",
      reference: "Who told you about us?",
      referenceHint: "A volunteer’s or trustee’s name, if anyone.",
      occupation: "Occupation",
      student: "Student",
      job: "Job",
      business: "Business",
      education: "Education",
      educationOptions: [
        "I–IX (school)",
        "SSC",
        "HSC (11th, 12th)",
        "Diploma",
        "Graduate (B.Com, B.Sc, etc.)",
        "Engineering (BE, B.Tech, etc.)",
        "Medical (MBBS, BAMS, BDS, etc.)",
        "Architecture (B.Arch)",
        "Post-graduate",
        "PhD",
        "Other",
      ],
      specialisation: "Specialisation or profession",
      specialisationHint: "e.g. nursing, teaching, software",
      educationStatus: "Education status",
      pursuing: "Pursuing",
      completed: "Completed",
      message: "Anything you’d like us to know?",
    },
    csr: {
      submit: "Send enquiry",
      thanks: "Someone from the trust will get in touch to talk about a partnership.",
      whatsappMessage: "Hi! I’d like to talk about a CSR partnership with Sarvamangal Education Trust.",
      name: "Your name",
      company: "Company",
      phone: "Phone",
      email: "Work email",
      address: "Company address",
      message: "What would you like to support?",
      messageHint: "A cause, a kind of camp, a place — or just a question.",
    },
    contact: {
      submit: "Send message",
      thanks: "We’ll reply on the phone number or email you gave us.",
      whatsappMessage: "Hi! I have a question for Sarvamangal Education Trust.",
      name: "Your name",
      phone: "Phone",
      phoneHint: "A phone number or an email — we need one to reply.",
      email: "Email",
      message: "Your message",
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
    /** A camp's photos and the full-screen viewer. */
    gallery: {
      showAll: "Show all {n} photos",
      viewer: "Photos from {title}",
      photoOf: "Photo {n} of {total}",
      close: "Close photos",
      previous: "Previous photo",
      next: "Next photo",
    },
    /** The privacy policy and terms pages. */
    policy: {
      contents: "On this page",
      updated: "Last updated: {date}",
    },
    /** The trust's registration details (About and CSR pages). */
    trust: {
      registration: "Public trust registration",
      pan: "PAN",
      eightyG: "80G registration",
      since: "since {date}",
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
  policies: "policy-text",
  forms: "form-text",
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
