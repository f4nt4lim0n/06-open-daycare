import Link from "next/link";

interface AuthSubmitLinkProps {
  children: React.ReactNode;
  href: string;
}

export const AuthSubmitLink = ({
  children,
  href,
}: AuthSubmitLinkProps) => {
  return (
    <Link href={href} style={{
      display: "block",
      textAlign: "center",
      width: "100%",
      padding: "15px",
      borderRadius: "15px",
      background: "linear-gradient(180deg, #F4977E, #EE8164)",
      color: "#fff",
      fontWeight: "800",
      fontSize: "16px",
      boxShadow: "0 10px 22px -8px rgba(238, 129, 100, 0.7)",
      marginBottom: "24px",
    }}>
      {children}
    </Link>
  );
};