import type { CollectionConfig } from "payload";

import { adminsOnly, signedIn } from "../access";

const isKind = (kind: string) => (data: Record<string, unknown> | undefined) => data?.kind === kind;

/**
 * Messages from the website's forms: volunteer sign-ups, CSR enquiries and
 * contact messages. The website saves them on the server (src/lib/enquiries.ts);
 * the public API can't read or create them.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "phone", "status", "createdAt"],
    description: "Volunteer sign-ups, CSR enquiries and messages from the website. Mark each one as you follow up.",
  },
  defaultSort: "-createdAt",
  access: { read: signedIn, create: signedIn, update: signedIn, delete: adminsOnly },
  fields: [
    {
      name: "kind",
      label: "Form",
      type: "select",
      required: true,
      options: [
        { label: "Volunteer", value: "volunteer" },
        { label: "CSR / company", value: "csr" },
        { label: "Contact message", value: "contact" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "name", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", admin: { width: "50%" } },
        { name: "email", type: "email", admin: { width: "50%" } },
      ],
    },
    { name: "company", label: "Company", type: "text", admin: { condition: isKind("csr") } },
    { name: "address", type: "textarea" },
    {
      type: "row",
      fields: [
        { name: "pincode", label: "PIN code", type: "text", admin: { width: "33%" } },
        {
          name: "dateOfBirth",
          label: "Date of birth",
          type: "date",
          admin: { width: "33%", condition: isKind("volunteer"), date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
        },
        { name: "reference", label: "Referred by", type: "text", admin: { width: "33%", condition: isKind("volunteer") } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "occupation",
          type: "select",
          options: [
            { label: "Student", value: "student" },
            { label: "Job", value: "job" },
            { label: "Business", value: "business" },
          ],
          admin: { width: "25%", condition: isKind("volunteer") },
        },
        { name: "education", type: "text", admin: { width: "25%", condition: isKind("volunteer") } },
        {
          name: "educationStatus",
          label: "Education status",
          type: "select",
          options: [
            { label: "Pursuing", value: "pursuing" },
            { label: "Completed", value: "completed" },
          ],
          admin: { width: "25%", condition: isKind("volunteer") },
        },
        {
          name: "specialisation",
          label: "Specialisation / profession",
          type: "text",
          admin: { width: "25%", condition: isKind("volunteer") },
        },
      ],
    },
    { name: "message", type: "textarea" },
  ],
};
