"use server";

import config from "@payload-config";
import { getPayload } from "payload";

/**
 * Saves the website's forms (volunteer, CSR, contact) into the Payload
 * "enquiries" collection, which the team reads in /admin → Inbox. Runs on the
 * server only; the public API can't write there.
 */

export type EnquiryKind = "volunteer" | "csr" | "contact";

export type EnquiryState = {
  status: "idle" | "sent" | "invalid" | "unavailable" | "error";
  /** Field name → what to fix. */
  errors?: Record<string, string>;
  /** What was submitted, so the form keeps it after an error. */
  values?: Record<string, string>;
};

const KINDS: EnquiryKind[] = ["volunteer", "csr", "contact"];

/** Field → maximum length kept. */
const FIELDS = {
  name: 80,
  phone: 20,
  email: 120,
  company: 120,
  address: 400,
  pincode: 6,
  dateOfBirth: 10,
  reference: 80,
  occupation: 20,
  education: 80,
  educationStatus: 20,
  specialisation: 120,
  message: 1500,
} as const;

type Values = Record<keyof typeof FIELDS, string>;

function validate(kind: EnquiryKind, v: Values) {
  const errors: Record<string, string> = {};
  const digits = v.phone.replace(/\D/g, "");
  const phoneOk = digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));

  if (v.name.length < 2) errors.name = "Enter your name.";
  if (v.phone && !phoneOk) errors.phone = "Enter a 10-digit mobile number, like 98200 12345.";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter an email address like name@example.com.";

  if (kind === "volunteer" || kind === "csr") {
    if (!v.phone) errors.phone = "Enter your mobile number so we can call you.";
  }
  if (kind === "volunteer") {
    if (v.pincode && !/^\d{6}$/.test(v.pincode)) errors.pincode = "Enter a 6-digit PIN code.";
    if (v.dateOfBirth && Number.isNaN(Date.parse(v.dateOfBirth))) errors.dateOfBirth = "Enter a valid date.";
  }
  if (kind === "csr") {
    if (!v.email) errors.email = "Enter your work email.";
    if (!v.company) errors.company = "Enter your company's name.";
    if (!v.address) errors.address = "Enter your company's address.";
  }
  if (kind === "contact") {
    if (!v.phone && !v.email) errors.phone = "Enter a phone number or an email address so we can reply.";
    if (v.message.length < 5) errors.message = "Write your message.";
  }
  return errors;
}

export async function submitEnquiry(_previous: EnquiryState, form: FormData): Promise<EnquiryState> {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const kind = get("kind") as EnquiryKind;
  if (!KINDS.includes(kind)) return { status: "error" };

  // Spam trap: a field people never see. Bots fill it; pretend all went well.
  if (get("website")) return { status: "sent" };

  const values = Object.fromEntries(
    Object.entries(FIELDS).map(([key, max]) => [key, get(key).slice(0, max)]),
  ) as Values;

  const errors = validate(kind, values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  // No database (e.g. a deployment running on the built-in content): nowhere to save.
  if (!process.env.DATABASE_URI) return { status: "unavailable", values };

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "enquiries",
      overrideAccess: true,
      data: {
        kind,
        status: "new",
        name: values.name,
        phone: values.phone || null,
        email: values.email || null,
        company: values.company || null,
        address: values.address || null,
        pincode: values.pincode || null,
        dateOfBirth: values.dateOfBirth ? `${values.dateOfBirth}T12:00:00.000Z` : null,
        reference: values.reference || null,
        occupation: (values.occupation || null) as "student" | "job" | "business" | null,
        education: values.education || null,
        educationStatus: (values.educationStatus || null) as "pursuing" | "completed" | null,
        specialisation: values.specialisation || null,
        message: values.message || null,
      },
    });
    return { status: "sent" };
  } catch (error) {
    console.error("Saving an enquiry failed:", error);
    return { status: "error", values };
  }
}
