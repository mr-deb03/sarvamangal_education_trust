import { PolicyPage, policyMetadata } from "@/components/legal/PolicyPage";

/** The trust's terms & conditions — all of it editable in /admin → Website text → Policies. */
export const generateMetadata = () => policyMetadata("terms");

export default function TermsPage() {
  return <PolicyPage which="terms" />;
}
