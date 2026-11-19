import { formatAmount } from "@/lib/format";

/**
 * An amount in rupees, "₹1,500", with the ₹ drawn in Mukta (`.rupee`), which
 * keeps the extended-Latin font files off the page. Plain text for screen
 * readers and search engines reads the same.
 */
export function Rupees({ amount }: { amount: number }) {
  return (
    <>
      <span className="rupee">₹</span>
      {formatAmount(amount)}
    </>
  );
}
