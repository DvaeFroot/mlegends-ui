import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ML CheatSheet",
  description: "Mobile Legends Bang Bang champion and item reference",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            background: "#0a0c12",
            borderBottom: "1px solid #2a3147",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div className="header-inner">
            <Link
              href="/"
              className="header-logo"
              style={{
                color: "#e8b84b",
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "0.05em",
                textDecoration: "none",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              ML CheatSheet
            </Link>
            <nav className="header-nav" style={{ display: "flex", gap: "4px" }}>
              {[
                { href: "/champions", label: "Champions" },
                { href: "/items", label: "Items" },
                { href: "/history", label: "History" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "#8b92a8",
                    textDecoration: "none",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                  }}
                  className="nav-link"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="page-container">
          {children}
        </main>
        <style>{`
          .nav-link:hover {
            color: #c8d0e0 !important;
            background: #1e2436 !important;
          }
        `}</style>
      </body>
    </html>
  );
}
