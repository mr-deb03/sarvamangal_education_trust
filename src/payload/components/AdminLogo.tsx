import Image from "next/image";

/** The trust's logo on the admin sign-in screen. */
export function AdminLogo() {
  return (
    <Image
      src="/brand/sarvamangal-logo.png"
      alt="Sarvamangal Education Trust"
      width={1600}
      height={500}
      style={{ height: 64, width: "auto" }}
    />
  );
}

/** The round mark in the admin navigation. */
export function AdminIcon() {
  return <Image src="/brand/sarvamangal-mark.png" alt="" width={458} height={458} style={{ height: 28, width: 28 }} />;
}
