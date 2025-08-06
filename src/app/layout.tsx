
import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import '@fortawesome/fontawesome-free/css/all.min.css';


export const metadata: Metadata = {
  title: "Omar Habib - Frontend Developer",
  description: "Personal portfolio of Omar Habib",
  icons: {
  icon: "/images/logo.jpg",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <body className="bg-dark-purple">
        <div className="container-fluid p-0">
          <NavBar />
          {children}
          
        </div>

        {/* Bootstrap JS Bundle */}
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