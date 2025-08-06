
import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import '@fortawesome/fontawesome-free/css/all.min.css';


export const metadata: Metadata = {
  title: "نور الرحمن - تطبيق إسلامي شامل",
  description:
    "تطبيق نور الرحمن يقدم القرآن الكريم، الأذكار، البث المباشر، مواقيت الصلاة والمزيد لخدمة المسلمين حول العالم.",
  keywords: [
    "نور الرحمن",
    "تطبيق إسلامي",
    "قرآن كريم",
    "أذكار",
    "أوقات الصلاة",
    "بث مباشر",
    "مساجد قريبة"
  ],
  authors: [{ name: "Omar Habib" }],
  openGraph: {
    title: "نور الرحمن - تطبيق إسلامي شامل",
    description:
      "تطبيق متكامل يوفر القرآن الكريم والأذكار والبث المباشر للقنوات الإسلامية.",
    url: "https://your-domain.com",
    siteName: "نور الرحمن",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "نور الرحمن - تطبيق إسلامي شامل",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نور الرحمن - تطبيق إسلامي شامل",
    description:
      "تطبيق نور الرحمن يقدم القرآن الكريم، الأذكار، البث المباشر، مواقيت الصلاة والمزيد لخدمة المسلمين.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-dark-purple">
        <div className="container-fluid p-0">
          <NavBar />
          {children}
        </div>

        {/* ✅ Bootstrap JS Bundle */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          async
        ></script>
      </body>
    </html>
  );
}
