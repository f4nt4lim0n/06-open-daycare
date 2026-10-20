import { AuthSubmitLink } from "@/components/auth/AuthSubmitLink";
import Link from "next/link";
import { InviteCard } from "@/components/auth/InviteCard";

const MOCK_INVITE_CODE = "7K4P9";
const MOCK_EMAIL_VALUE = "lucia.fernandez@gmail.com";
const MOCK_PASSWORD_VALUE = "contraseña";

export default function ActivateAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)]">
      <InviteCard
        inviteCode={MOCK_INVITE_CODE}
        inviteEmail={MOCK_EMAIL_VALUE}
        mockPassword={MOCK_PASSWORD_VALUE}
      />

      <AuthSubmitLink href="/">Activar mi cuenta</AuthSubmitLink>

      <p style={{
        textAlign: "center",
        margin: "22px 0 0",
        color: "#94887B",
        fontSize: "14.5px",
      }}>
        ¿Ya tenés cuenta? <Link href="/login" style={{ color: "#C5503A", fontWeight: "800" }}>Iniciar sesión</Link>
      </p>
    </div>
  );
}