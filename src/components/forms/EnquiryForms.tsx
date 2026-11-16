"use client";

import { CircleCheck, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import { submitEnquiry, type EnquiryKind, type EnquiryState } from "@/lib/enquiries";
import { ROUTES } from "@/lib/site";
import { cn, whatsappHref } from "@/lib/utils";

const initial: EnquiryState = { status: "idle" };

const control =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition-colors focus:border-ink/40 focus:outline-3 focus:outline-offset-1 focus:outline-crimson/70 aria-[invalid=true]:border-crimson";

type FieldProps = {
  name: string;
  label: string;
  state: EnquiryState;
  required?: boolean;
  hint?: string;
  className?: string;
} & (
  | { as?: "input"; type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "numeric" | "text"; placeholder?: string; maxLength?: number }
  | { as: "textarea"; rows?: number; placeholder?: string; maxLength?: number; autoComplete?: string }
  | { as: "select"; options: string[]; placeholder?: string }
);

/** A labelled field with its hint and error underneath. */
function Field(props: FieldProps) {
  const { name, label, state, required, hint, className } = props;
  const error = state.errors?.[name];
  const value = state.values?.[name] ?? "";
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id: name,
    name,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue: value,
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="text-[0.95rem] font-semibold text-ink">
        {label}
        {required ? <span className="text-crimson"> *</span> : <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {props.as === "textarea" ? (
        <textarea {...common} rows={props.rows ?? 4} placeholder={props.placeholder} maxLength={props.maxLength} autoComplete={props.autoComplete} className={control} />
      ) : props.as === "select" ? (
        <select {...common} className={control}>
          <option value="">{props.placeholder ?? "Choose…"}</option>
          {props.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={props.type ?? "text"}
          autoComplete={props.autoComplete}
          inputMode={props.inputMode}
          // No red squiggles under email addresses, phone numbers and PIN codes.
          spellCheck={props.type === "email" || props.type === "tel" || props.inputMode === "numeric" ? false : undefined}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          className={control}
        />
      )}
      {hint ? (
        <p id={`${name}-hint`} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-sm font-semibold text-crimson">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Radio buttons styled as pills (occupation, education status). */
function Choice({ name, label, options, state }: { name: string; label: string; options: { value: string; label: string }[]; state: EnquiryState }) {
  const current = state.values?.[name] ?? "";
  return (
    <fieldset>
      <legend className="text-[0.95rem] font-semibold text-ink">
        {label} <span className="font-normal text-ink-muted">(optional)</span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 has-checked:border-crimson has-checked:bg-crimson/[0.05] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-crimson"
          >
            <input type="radio" name={name} value={o.value} defaultChecked={current === o.value} className="accent-crimson" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Shared form shell: the action, spam trap, messages, submit button and the thank-you. */
function EnquiryForm({
  kind,
  whatsappNumber,
  whatsappText,
  submitLabel,
  thanks,
  children,
}: {
  kind: EnquiryKind;
  whatsappNumber: string;
  whatsappText: string;
  submitLabel: string;
  thanks: string;
  children: (state: EnquiryState) => ReactNode;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const wa = whatsappHref(whatsappNumber, whatsappText);

  // Take the visitor to the first field that needs fixing.
  useEffect(() => {
    if (state.status === "invalid") formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-[1.5rem] bg-white p-8 text-center ring-1 ring-line">
        <CircleCheck aria-hidden className="mx-auto size-12 text-crimson" strokeWidth={1.6} />
        <p className="mt-4 font-display text-2xl font-semibold text-ink">Thank you — we’ve got it.</p>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">{thanks}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-5 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-8">
      <input type="hidden" name="kind" value={kind} />
      {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-website`}>Leave this empty</label>
        <input id={`${kind}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {children(state)}

      {state.status === "invalid" ? (
        <p role="alert" className="text-sm font-semibold text-crimson">
          Please fix the fields marked above.
        </p>
      ) : null}
      {state.status === "unavailable" || state.status === "error" ? (
        <p role="alert" className="rounded-xl bg-marigold-soft/50 p-4 text-[0.95rem] text-ink">
          We couldn’t send this from the website just now.{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-crimson underline underline-offset-4">
            Send it to us on WhatsApp instead
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={pending} className={cn(buttonClasses("primary", "lg"), "disabled:cursor-wait disabled:opacity-70")}>
          <Send aria-hidden />
          {pending ? "Sending…" : submitLabel}
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink-soft hover:text-crimson">
          <MessageCircle aria-hidden className="size-5 text-crimson" />
          Or message us on WhatsApp
        </a>
      </div>
      <p className="text-sm text-ink-muted">
        We use these details only to get back to you. See our{" "}
        <Link href={ROUTES.privacy} className="underline underline-offset-4 hover:text-crimson">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

const EDUCATION = [
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
];

/** The old site's volunteer form, field for field, plus an optional email and note. */
export function VolunteerForm({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <EnquiryForm
      kind="volunteer"
      whatsappNumber={whatsappNumber}
      whatsappText="Hi! I'd like to volunteer with Sarvamangal Education Trust."
      submitLabel="Send my details"
      thanks="Someone from the trust will get in touch about the next camp you can help at."
    >
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name" required autoComplete="name" maxLength={80} state={state} />
            <Field name="phone" label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="98200 12345" maxLength={20} state={state} />
            <Field name="email" label="Email" type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} />
            <Field name="dateOfBirth" label="Date of birth" type="date" autoComplete="bday" state={state} />
          </div>
          <Field as="textarea" name="address" label="Home address" rows={2} autoComplete="street-address" maxLength={400} state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="pincode" label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} state={state} />
            <Field name="reference" label="Who told you about us?" hint="A volunteer’s or trustee’s name, if anyone." maxLength={80} state={state} />
          </div>
          <Choice
            name="occupation"
            label="Occupation"
            state={state}
            options={[
              { value: "student", label: "Student" },
              { value: "job", label: "Job" },
              { value: "business", label: "Business" },
            ]}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field as="select" name="education" label="Education" options={EDUCATION} state={state} />
            <Field name="specialisation" label="Specialisation or profession" hint="e.g. nursing, teaching, software" maxLength={120} state={state} />
          </div>
          <Choice
            name="educationStatus"
            label="Education status"
            state={state}
            options={[
              { value: "pursuing", label: "Pursuing" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <Field as="textarea" name="message" label="Anything you’d like us to know?" rows={3} maxLength={1500} state={state} />
        </>
      )}
    </EnquiryForm>
  );
}

/** The old site's CSR registration form, plus an optional note. */
export function CsrForm({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <EnquiryForm
      kind="csr"
      whatsappNumber={whatsappNumber}
      whatsappText="Hi! I'd like to talk about a CSR partnership with Sarvamangal Education Trust."
      submitLabel="Send enquiry"
      thanks="Someone from the trust will get in touch to talk about a partnership."
    >
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Your name" required autoComplete="name" maxLength={80} state={state} />
            <Field name="company" label="Company" required autoComplete="organization" maxLength={120} state={state} />
            <Field name="phone" label="Phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="98200 12345" maxLength={20} state={state} />
            <Field name="email" label="Work email" required type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} />
          </div>
          <Field as="textarea" name="address" label="Company address" required rows={2} autoComplete="street-address" maxLength={400} state={state} />
          <Field
            as="textarea"
            name="message"
            label="What would you like to support?"
            hint="A cause, a kind of camp, a place — or just a question."
            rows={3}
            maxLength={1500}
            state={state}
          />
        </>
      )}
    </EnquiryForm>
  );
}

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <EnquiryForm
      kind="contact"
      whatsappNumber={whatsappNumber}
      whatsappText="Hi! I have a question for Sarvamangal Education Trust."
      submitLabel="Send message"
      thanks="We’ll reply on the phone number or email you gave us."
    >
      {(state) => (
        <>
          <Field name="name" label="Your name" required autoComplete="name" maxLength={80} state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98200 12345" maxLength={20} state={state} hint="A phone number or an email — we need one to reply." />
            <Field name="email" label="Email" type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} />
          </div>
          <Field as="textarea" name="message" label="Your message" required rows={5} maxLength={1500} state={state} />
        </>
      )}
    </EnquiryForm>
  );
}
