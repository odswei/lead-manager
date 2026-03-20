import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lead Manager | Lead Tracking Dashboard",
    template: "%s | Lead Manager"
  },
  description:
    "Lead Manager is a lightweight dashboard to capture, organize, and track sales leads by status in real time.",
  applicationName: "Lead Manager",
  keywords: [
    "lead manager",
    "lead tracking",
    "crm",
    "sales leads",
    "nextjs dashboard"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Lead Manager | Lead Tracking Dashboard",
    description:
      "Capture and manage leads with a fast dashboard built using Next.js and Express.",
    url: "/",
    siteName: "Lead Manager",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Manager | Lead Tracking Dashboard",
    description:
      "Capture and manage leads with a fast dashboard built using Next.js and Express."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
