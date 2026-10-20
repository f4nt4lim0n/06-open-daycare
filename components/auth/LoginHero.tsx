import { SunIcon } from "../shared/icons";

export const LoginHero = () => {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(155deg, #F6A98E 0%, #F2937A 45%, #EC7E62 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "56px 60px",
      color: "#fff",
      minHeight: "100vh",
    }}>
      <div style={{
        position: "absolute",
        width: "420px",
        height: "420px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.12)",
        top: "-140px",
        right: "-120px",
      }} />
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.10)",
        bottom: "-110px",
        left: "-80px",
      }} />
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "13px",
        position: "relative",
      }}>
        <div style={{
          width: "46px",
          height: "46px",
          borderRadius: "14px",
          background: "rgba(255, 255, 255, 0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <SunIcon width={26} height={26} stroke="#fff" strokeWidth={2.2} />
        </div>
        <span style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: "600",
          fontSize: "21px",
          letterSpacing: ".5px",
        }}>OpenDayCare</span>
      </div>
      <div style={{ position: "relative" }}>
        <h1 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: "600",
          fontSize: "42px",
          lineHeight: "1.12",
          margin: "0 0 18px",
        }}>
          El día de cada niño,<br />
          compartido con su familia.
        </h1>
        <p style={{
          fontSize: "17px",
          lineHeight: "1.6",
          margin: "0",
          maxWidth: "430px",
          color: "rgba(255, 255, 255, 0.92)",
        }}>
          Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
        </p>
      </div>
      <div style={{
        position: "relative",
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.9)",
      }}>🌿 Guardería Sala Soles</div>
    </div>
  );
};