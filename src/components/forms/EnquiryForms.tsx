"use client";

import { CircleCheck, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { buttonClasses } from "@/components/ui/ButtonLink";
import { Fill } from "@/components/ui/Fill";
import type { SiteCopy } from "@/lib/cms/types";
import { submitEnquiry, type EnquiryKind, type EnquiryState } from "@/lib/enquiries";
import { ROUTES } from "@/lib/site";
import { cn, whatsappHref } from "@/lib/utils";

/** Website text → Forms, plus the privacy policy's link text. */
export type FormsText = SiteCopy["forms"] & { privacyLinkText: string };

const initial: EnquiryState = { status: "idle" };

const control =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 transition-colors focus:border-ink/40 focus:outline-3 focus:outline-offset-1 focus:outline-crimson/70 aria-[invalid=true]:border-crimson";

type FieldProps = {
  name: string;
  label: string;
  state: EnquiryState;
  common: FormsText["common"];
  required?: boolean;
  hint?: string;
  className?: string;
} & (
  | { as?: "input"; type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "numeric" | "text"; placeholder?: string; maxLength?: number }
  | { as: "textarea"; rows?: number; maxLength?: number; autoComplete?: string }
  | { as: "select"; options: string[] }
);

/** A labelled field with its hint and error underneath. */
function Field(props: FieldProps) {
  const { name, label, state, common, required, hint, className } = props;
  const error = state.errors?.[name];
  const value = state.values?.[name] ?? "";
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;
  const shared = {
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
        {required ? (
          <span className="text-crimson"> {common.requiredMark}</span>
        ) : (
          <span className="font-normal text-ink-muted"> {common.optional}</span>
        )}
      </label>
      {props.as === "textarea" ? (
        <textarea {...shared} rows={props.rows ?? 4} maxLength={props.maxLength} autoComplete={props.autoComplete} className={control} />
      ) : props.as === "select" ? (
        <select {...shared} className={control}>
          <option value="">{common.choose}</option>
          {props.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...shared}
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
function Choice({
  name,
  label,
  options,
  state,
  common,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  state: EnquiryState;
  common: FormsText["common"];
}) {
  const current = state.values?.[name] ?? "";
  return (
    <fieldset>
      <legend className="text-[0.95rem] font-semibold text-ink">
        {label} <span className="font-normal text-ink-muted">{common.optional}</span>
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
  text,
  whatsappNumber,
  whatsappText,
  submitLabel,
  thanks,
  children,
}: {
  kind: EnquiryKind;
  text: FormsText;
  whatsappNumber: string;
  whatsappText: string;
  submitLabel: string;
  thanks: string;
  children: (state: EnquiryState) => ReactNode;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const wa = whatsappHref(whatsappNumber, whatsappText);
  const { common } = text;

  // Take the visitor to the first field that needs fixing.
  useEffect(() => {
    if (state.status === "invalid") formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-[1.5rem] bg-white p-8 text-center ring-1 ring-line">
        <CircleCheck aria-hidden className="mx-auto size-12 text-crimson" strokeWidth={1.6} />
        <p className="mt-4 font-display text-2xl font-semibold text-ink">{common.thanksTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-ink-muted">{thanks}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-5 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-8">
      <input type="hidden" name="kind" value={kind} />
      {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-website`}>{common.spamTrap}</label>
        <input id={`${kind}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {children(state)}

      {state.status === "invalid" ? (
        <p role="alert" className="text-sm font-semibold text-crimson">
          {common.fixErrors}
        </p>
      ) : null}
      {state.status === "unavailable" || state.status === "error" ? (
        <p role="alert" className="rounded-xl bg-marigold-soft/50 p-4 text-[0.95rem] text-ink">
          {common.unavailable}{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-crimson underline underline-offset-4">
            {common.unavailableCta}
          </a>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={pending} className={cn(buttonClasses("primary", "lg"), "disabled:cursor-wait disabled:opacity-70")}>
          <Send aria-hidden />
          {pending ? common.sending : submitLabel}
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink-soft hover:text-crimson">
          <MessageCircle aria-hidden className="size-5 text-crimson" />
          {common.orWhatsapp}
        </a>
      </div>
      <p className="text-sm text-ink-muted">
        <Fill
          template={common.privacyNote}
          vars={{
            privacyLink: (
              <Link href={ROUTES.privacy} className="underline underline-offset-4 hover:text-crimson">
                {text.privacyLinkText}
              </Link>
            ),
          }}
        />
      </p>
    </form>
  );
}

/** The old site's volunteer form, field for field, plus an optional email and note. */
export function VolunteerForm({ whatsappNumber, text }: { whatsappNumber: string; text: FormsText }) {
  const t = text.volunteer;
  const { common } = text;
  return (
    <EnquiryForm
      kind="volunteer"
      text={text}
      whatsappNumber={whatsappNumber}
      whatsappText={t.whatsappMessage}
      submitLabel={t.submit}
      thanks={t.thanks}
    >
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label={t.name} required autoComplete="name" maxLength={80} state={state} common={common} />
            <Field
              name="phone"
              label={t.phone}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={common.phonePlaceholder}
              maxLength={20}
              state={state}
              common={common}
            />
            <Field name="email" label={t.email} type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} common={common} />
            <Field name="dateOfBirth" label={t.dateOfBirth} type="date" autoComplete="bday" state={state} common={common} />
          </div>
          <Field as="textarea" name="address" label={t.address} rows={2} autoComplete="street-address" maxLength={400} state={state} common={common} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="pincode" label={t.pincode} inputMode="numeric" autoComplete="postal-code" maxLength={6} state={state} common={common} />
            <Field name="reference" label={t.reference} hint={t.referenceHint} maxLength={80} state={state} common={common} />
          </div>
          <Choice
            name="occupation"
            label={t.occupation}
            state={state}
            common={common}
            options={[
              { value: "student", label: t.student },
              { value: "job", label: t.job },
              { value: "business", label: t.business },
            ]}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field as="select" name="education" label={t.education} options={t.educationOptions} state={state} common={common} />
            <Field name="specialisation" label={t.specialisation} hint={t.specialisationHint} maxLength={120} state={state} common={common} />
          </div>
          <Choice
            name="educationStatus"
            label={t.educationStatus}
            state={state}
            common={common}
            options={[
              { value: "pursuing", label: t.pursuing },
              { value: "completed", label: t.completed },
            ]}
          />
          <Field as="textarea" name="message" label={t.message} rows={3} maxLength={1500} state={state} common={common} />
        </>
      )}
    </EnquiryForm>
  );
}

/** The old site's CSR registration form, plus an optional note. */
export function CsrForm({ whatsappNumber, text }: { whatsappNumber: string; text: FormsText }) {
  const t = text.csr;
  const { common } = text;
  return (
    <EnquiryForm kind="csr" text={text} whatsappNumber={whatsappNumber} whatsappText={t.whatsappMessage} submitLabel={t.submit} thanks={t.thanks}>
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label={t.name} required autoComplete="name" maxLength={80} state={state} common={common} />
            <Field name="company" label={t.company} required autoComplete="organization" maxLength={120} state={state} common={common} />
            <Field
              name="phone"
              label={t.phone}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={common.phonePlaceholder}
              maxLength={20}
              state={state}
              common={common}
            />
            <Field name="email" label={t.email} required type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} common={common} />
          </div>
          <Field as="textarea" name="address" label={t.address} required rows={2} autoComplete="street-address" maxLength={400} state={state} common={common} />
          <Field as="textarea" name="message" label={t.message} hint={t.messageHint} rows={3} maxLength={1500} state={state} common={common} />
        </>
      )}
    </EnquiryForm>
  );
}

export function ContactForm({ whatsappNumber, text }: { whatsappNumber: string; text: FormsText }) {
  const t = text.contact;
  const { common } = text;
  return (
    <EnquiryForm
      kind="contact"
      text={text}
      whatsappNumber={whatsappNumber}
      whatsappText={t.whatsappMessage}
      submitLabel={t.submit}
      thanks={t.thanks}
    >
      {(state) => (
        <>
          <Field name="name" label={t.name} required autoComplete="name" maxLength={80} state={state} common={common} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="phone"
              label={t.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={common.phonePlaceholder}
              maxLength={20}
              hint={t.phoneHint}
              state={state}
              common={common}
            />
            <Field name="email" label={t.email} type="email" inputMode="email" autoComplete="email" maxLength={120} state={state} common={common} />
          </div>
          <Field as="textarea" name="message" label={t.message} required rows={5} maxLength={1500} state={state} common={common} />
        </>
      )}
    </EnquiryForm>
  );
}
