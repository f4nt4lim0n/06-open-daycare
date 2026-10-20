import { SunIcon } from "../shared/icons";

interface InviteCardProps {
  inviteCode: string;
  inviteEmail: string;
  mockPassword: string;
}

export const InviteCard = ({ inviteCode, inviteEmail, mockPassword }: InviteCardProps) => {
  return (
    <div>
      {/* Ícono de sol en cuadro con gradiente */}
      <div style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: "linear-gradient(155deg, #F8C3A8, #F2937A)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "22px",
        boxShadow: "0 12px 26px -10px rgba(238, 129, 100, 0.65)",
      }}>
        <SunIcon width={30} height={30} stroke="#fff" strokeWidth={2.2} />
      </div>

      <h1 style={{
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: "600",
        fontSize: "32px",
        lineHeight: "1.15",
        margin: "0 0 8px",
        color: "#3F362E",
      }}>
        Bienvenida a OpenDayCare
      </h1>

      <p style={{
        margin: "0 0 26px",
        color: "#94887B",
        fontSize: "15.5px",
        lineHeight: "1.55",
      }}>
        Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
      </p>

      {/* Tarjeta de invitación */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        background: "#fff",
        border: "1.5px solid #EADFD0",
        borderRadius: "16px",
        padding: "14px 16px",
        marginBottom: "22px",
      }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#A9D9E8",
          color: "#1F7A93",
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: "600",
          fontSize: "19px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          M
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "#94887B" }}>Te invitaron a seguir a</div>
          <div style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: "600",
            fontSize: "17px",
            color: "#3F362E",
          }}>
            Mateo · Sala Soles
          </div>
        </div>
      </div>

      {/* CÓDIGO DE INVITACIÓN */}
      <div style={{
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: ".7px",
        color: "#94887B",
        marginBottom: "8px",
      }}>
        CÓDIGO DE INVITACIÓN
      </div>
      <input
        defaultValue={inviteCode}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1.5px solid #EADFD0",
          background: "#fff",
          fontSize: "18px",
          letterSpacing: "3px",
          fontWeight: "700",
          color: "#3F362E",
          marginBottom: "18px",
          fontFamily: "'Fredoka', sans-serif",
        }}
      />

      {/* EMAIL */}
      <div style={{
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: ".7px",
        color: "#94887B",
        marginBottom: "8px",
      }}>
        EMAIL
      </div>
      <input
        defaultValue={inviteEmail}
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
      />

      {/* CREAR CONTRASEÑA */}
      <div style={{
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: ".7px",
        color: "#94887B",
        marginBottom: "8px",
      }}>
        CREAR CONTRASEÑA
      </div>
      <input
        defaultValue={mockPassword}
        type="password"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1.5px solid #F2A78E",
          background: "#fff",
          fontSize: "15px",
          color: "#3F362E",
          marginBottom: "24px",
        }}
      />

      {/* Checkbox de autorización estático (sin cursor pointer) */}
      <label style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: "#FBF1D6",
        borderRadius: "14px",
        padding: "14px 16px",
        marginBottom: "24px",
        cursor: "default",
      }}>
        <span style={{
          flex: "none",
          width: "24px",
          height: "24px",
          borderRadius: "8px",
          background: "#5FB97E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1px",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span style={{ fontSize: "14px", color: "#8A7234", lineHeight: "1.45" }}>
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
        </span>
      </label>

      {/* Botón y link */}
      {/* AuthSubmitLink será usado por la página padre */}
    </div>
  );
};