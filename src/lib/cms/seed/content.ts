import type {
  Cause,
  DonationTier,
  Faq,
  SiteSettings,
  Supporter,
  Testimonial,
} from "../types";

/**
 * Seed content for everything on the landing page except events.
 *
 * Facts come from the current website and the trust’s donation-receipt
 * template (registration, PAN and 80G numbers). Items marked CONFIRM are
 * drafts the trust must approve before launch. They are listed in CLAUDE.md
 * under "Content to confirm".
 */

export const seedSettings: SiteSettings = {
  hero: {
    eyebrow: "Sarvamangal Education Trust · Mumbai · since 2015",
    headlineLines: ["Every child deserves a notebook.", "Every elder deserves a doctor."],
    highlightWords: ["notebook", "doctor"],
    intro:
      "For over a decade our volunteers have run free camps across Maharashtra — medical check-ups, blood drives, notebooks for schoolchildren, career guidance for teenagers. Your gift keeps the next one free.",
    image: {
      src: "/images/children-notebook-distribution.jpg",
      alt: "Children at a Sarvamangal notebook distribution hold up their new notebooks",
      width: 1600,
      height: 1341,
    },
    insetImage: {
      src: "/images/orthopedic-checkup-elder-patient.jpg",
      alt: "A doctor writes notes for an elderly woman during a free orthopedic consultation",
      width: 1360,
      height: 805,
    },
    insetCaption: "Free orthopedic camp, Mumbai",
  },
  impactStats: [
    { value: "150+", label: "free camps and drives since 2015" },
    { value: "200+", label: "volunteers trained at a single Prarambh camp" },
    { value: "70", label: "patients seen at one orthopedic camp in Feb 2026" },
  ],
  notebookQuote: {
    text: "तुम शिक्षा को समय दो, शिक्षा तुम्हारा समय बदल देगी।",
    translation: "Give your time to education, and education will change your times.",
    note: "Printed on the notebooks we hand out to children",
  },
  donateUrl: "https://donation.sarvamangaleducationtrust.org/",
  whatsappNumber: "918108103856",
  contact: {
    addressLines: [
      "Shop No. 1, Om Niwas (Om Shiv Premises)",
      "Behind Shop No. 1, J.M. Road",
    ],
    locality: "Bhandup West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400078", // CONFIRM
    phone: "+91 81081 03856",
    email: "sarvamangaledutrust@gmail.com",
  },
  legal: {
    registrationNo: "E-0038125 (GBR)",
    pan: "ABGTS0900E",
    eightyGNo: "ABGTS0900EF20241",
    eightyGDate: "2024-09-13",
  },
  socials: [
    { platform: "facebook", url: "https://www.facebook.com/sarvamangalorg" },
    { platform: "instagram", url: "https://www.instagram.com/sarvamangalorg/" },
    { platform: "x", url: "https://x.com/sarvamangalorg" },
    { platform: "linkedin", url: "https://www.linkedin.com/company/sarvamangalorg/" },
    { platform: "youtube", url: "https://www.youtube.com/@Sarvamangalorg" },
  ],
};

export const seedCauses: Cause[] = [
  {
    slug: "health",
    title: "Health",
    tagline: "Care that comes to you",
    summary:
      "Free medical, orthopedic and bone-density check-ups, and blood donation drives — so problems are caught early, not when they hurt too much to ignore.",
    image: {
      src: "/images/free-medical-checkup-camp.jpg",
      alt: "A doctor checks a woman’s blood pressure at a free Sarvamangal medical camp while others wait their turn",
      width: 1600,
      height: 1067,
    },
    order: 1,
  },
  {
    slug: "education",
    title: "Education",
    tagline: "Tools, skills and confidence",
    summary:
      "Notebooks for schoolchildren, coding classes for kids, and seminars on exam anxiety and careers for teenagers working out what comes next.",
    image: {
      src: "/images/coding-with-kids.jpg",
      alt: "Children gather around a volunteer at a computer during a Coding with Kids session",
      width: 1441,
      height: 1080,
    },
    order: 2,
  },
  {
    slug: "society",
    title: "Society",
    tagline: "Cleaner streets, kinder neighbourhoods",
    summary:
      "Cleanliness and waste-management drives, tree plantation, and visits that bring care and company to children who need it most.",
    image: {
      src: "/images/world-environment-day-volunteers.jpg",
      alt: "Young volunteers wearing Sarvamangal lanyards collect waste from shops on World Environment Day",
      width: 1800,
      height: 1351,
    },
    order: 3,
  },
  {
    slug: "spirituality",
    title: "Spirituality",
    tagline: "Calm minds, steady hearts",
    summary:
      "Yoga, meditation and talks by mentors that help people find inner peace and purpose — including Prarambh, our volunteer training camps.",
    image: {
      src: "/images/yoga-day-session.jpg",
      alt: "Rows of participants sit on mats during a Yoga Day session",
      width: 1600,
      height: 1200,
    },
    order: 4,
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "seed-mahendra-dora",
    quote:
      "I am thrilled to express my heartfelt appreciation for the Sarvamangal Education Trust’s remarkable efforts in shaping young minds through education. As the co-founder of SITH Company, I firmly believe that education is the cornerstone of progress, and Sarvamangal shares this belief wholeheartedly. Their work resonates with our core values, and I am proud to support their mission.",
    name: "Mahendra Dora",
    role: "Co-founder, SITH Company",
    supporterSince: 2015,
    causeSlug: "education",
  },
  {
    id: "seed-samir-shinde",
    quote:
      "It brings me immense joy to support the Sarvamangal Education Trust in promoting spirituality. As the owner of Hayosha Insurance, I’ve always believed in giving back to the community and nurturing people’s spiritual well-being. Their initiatives create spaces for individuals to reconnect with themselves, find solace, and develop a sense of purpose beyond the material.",
    name: "Samir Shinde",
    role: "Owner, Hayosha Insurance",
    supporterSince: 2017,
    causeSlug: "spirituality",
  },
  {
    id: "seed-rammani-gupta",
    quote:
      "With immense pride, I share my experience supporting Sarvamangal in their noble endeavour to promote health and well-being. At Sarvam Associates, we understand the significance of a healthy society and the positive ripple effects it creates. Their initiatives, from medical camps to health awareness programmes, are making a real impact in communities.",
    name: "Rammani Gupta",
    role: "Sarvam Associates",
    supporterSince: 2020,
    causeSlug: "health",
  },
];

// CONFIRM: this list is copied from the current website’s supporters strip.
// Logos are the ones the old site displayed, trimmed and resized.
export const seedSupporters: Supporter[] = [
  {
    id: "seed-sith",
    name: "SITH Company",
    url: "https://sith.co.in",
    logo: { src: "/images/supporters/sith-company.png", alt: "SITH Company logo", width: 160, height: 160 },
  },
  {
    id: "seed-sarvam-associates",
    name: "Sarvam Associates",
    url: "https://sarvamassociates.com",
    logo: { src: "/images/supporters/sarvam-associates.png", alt: "Sarvam Associates logo", width: 160, height: 160 },
  },
  {
    id: "seed-accenture",
    name: "Accenture",
    url: "https://www.accenture.com",
    logo: { src: "/images/supporters/accenture.png", alt: "Accenture logo", width: 142, height: 155 },
  },
  {
    id: "seed-microsoft",
    name: "Microsoft",
    url: "https://www.microsoft.com/en-in",
    logo: { src: "/images/supporters/microsoft.png", alt: "Microsoft logo", width: 156, height: 160 },
  },
];

// CONFIRM: amounts and outcomes are drafts. The trust should set these from
// what a camp actually costs, and only promise what the books can show.
export const seedDonationTiers: DonationTier[] = [
  {
    id: "seed-tier-500",
    amount: 500,
    title: "Notebooks for schoolchildren",
    outcome: "Goes towards notebooks and stationery at our next distribution drive.",
    causeSlug: "education",
  },
  {
    id: "seed-tier-1500",
    amount: 1500,
    title: "A free check-up",
    outcome: "Helps cover tests and consultations at a free medical camp.",
    causeSlug: "health",
  },
  {
    id: "seed-tier-5000",
    amount: 5000,
    title: "A day of learning",
    outcome: "Helps run a Coding with Kids session or a career guidance seminar.",
    causeSlug: "education",
  },
  {
    id: "seed-tier-any",
    amount: null,
    title: "Wherever it’s needed most",
    outcome: "Choose your own amount. We’ll put it towards the next camp on the register.",
  },
];

export const seedFaqs: Faq[] = [
  {
    id: "seed-faq-80g",
    question: "Is my donation tax-deductible?",
    answer:
      "Yes. Donations to Sarvamangal Education Trust qualify for deduction under Section 80G of the Income Tax Act, 1961 (80G number ABGTS0900EF20241, dated 13 September 2024). Your receipt carries these details — keep it for your tax return.",
  },
  {
    id: "seed-faq-receipt",
    question: "Will I get a receipt?",
    answer:
      "Yes. Every donation made through our donation page gets a receipt with the trust’s registration and 80G details, sent to the email address you give us.",
  },
  {
    id: "seed-faq-use",
    question: "How is my donation used?",
    answer:
      "Donations pay for our free camps and drives across health, education, society and spirituality. Every camp is recorded on our events page with its date, place and the people it served, so you can see where the work happens.",
  },
  {
    id: "seed-faq-where",
    question: "Where do you run camps?",
    answer:
      "Mostly in Mumbai — Bhandup, Mulund and Ghatkopar — and across Maharashtra, including Pune, Lonavla and Neral. We have also worked in Pali, Rajasthan.",
  },
  {
    id: "seed-faq-volunteer",
    question: "How can I volunteer?",
    answer:
      "Fill in the volunteer form and we’ll get in touch about upcoming camps. Volunteers help run each camp on the ground, from registering visitors to handing out notebooks. No special skills needed.",
  },
  {
    id: "seed-faq-csr",
    question: "Can my company partner with you for CSR?",
    answer:
      "Yes. Write to sarvamangaledutrust@gmail.com or call +91 81081 03856. We’ll share our registration documents and plan a camp with your team, from health check-ups to notebook drives.",
  },
];
