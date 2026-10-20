import { LoginHero } from "@/components/auth/LoginHero";
import { AuthSubmitLink } from "@/components/auth/AuthSubmitLink";
import Link from "next/link";

const MOCK_EMAIL = "caro@opendaycare.com";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="lg:grid-cols-[1.05fr_1fr] grid-cols-1 gap-6 min-h-screen">
        <LoginHero />

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}>
          <div style={{
            width: "100%",
            maxWidth: "392px",
          }}>
            <h2 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: "600",
              fontSize: "30px",
              margin: "0 0 6px",
              color: "#3F362E",
            }}>
              Iniciar sesión
            </h2>
            <p style={{
              margin: "0 0 28px",
              color: "#94887B",
              fontSize: "15px",
            }}>
              Ingresá para ver el día de hoy.
            </p>

            {/* Sin bloque INGRESO COMO */}

            <div style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: ".7px",
              color: "#94887B",
              marginBottom: "9px",
            }}>
              EMAIL
            </div>
            <input
              defaultValue={MOCK_EMAIL}
              type="email"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1.5px solid #EADFD0",
                background: "#fff",
                fontSize: "15px",
                color: "#3F362E",
                marginBottom: "18px",
              }}
              placeholder="••••••••"
            />

            <div style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: ".7px",
              color: "#94887B",
              marginBottom: "8px",
            }}>
              CONTRASEÑA
            </div>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1.5px solid #EADFD0",
                background: "#fff",
                fontSize: "15px",
                color: "#3F362E",
                marginBottom: "10px",
              }}
            />

            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <Link href="#" style={{
                color: "#C5503A",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: "pointer",
              }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <AuthSubmitLink href="/">Iniciar sesión</AuthSubmitLink>

            <p style={{
              textAlign: "center",
              margin: "24px 0 0",
              color: "#94887B",
              fontSize: "14.5px",
            }}>
              ¿Te invitó la guardería? <Link href="/activate-account" style={{ color: "#C5503A", fontWeight: "800" }}>Activá tu cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}