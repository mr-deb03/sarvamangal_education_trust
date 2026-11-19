import { PolicyPage, policyMetadata } from "@/components/legal/PolicyPage";

/** The trust's privacy policy — all of it editable in /admin → Website text → Policies. */
export const generateMetadata = () => policyMetadata("privacy");

export default function PrivacyPolicyPage() {
  return <PolicyPage which="privacy" />;
}
