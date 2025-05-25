import Link from "next/link";
import LoginWithPassword from "../LoginWithPassword";

export default function LoginComponent() {
  return (
    <>
      <div>
        <LoginWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
