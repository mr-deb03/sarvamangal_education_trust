import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/** Above the sign-in form: who this screen is for. */
export function LoginIntro() {
  return (
    <div className="sm-login-intro">
      <h1 className="sm-login-intro__title">Sign in to update the website</h1>
      <p className="sm-login-intro__text">Camps, photos, the live ticker and the appeal — for the Sarvamangal team.</p>
    </div>
  );
}

/** Under the sign-in form (admin.components.afterLogin): a way back for visitors who landed here. */
export function LoginFooter() {
  return (
    <p className="sm-login-footer">
      <Link href="/" prefetch={false}>
        <ArrowLeft aria-hidden size={15} />
        Back to the website
      </Link>
    </p>
  );
}
