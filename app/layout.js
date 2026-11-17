import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Chummy Foods | AI Meal Planner & Traditional South Indian Foods",
  description:
    "100% natural, preservative-free traditional South Indian food mixes, millets, organic breakfast staples, and AI-powered 7-Day meal planning for health and vitality.",
  icons: {
    icon: "https://chummyfoods.com/cdn/shop/files/logo-view.png?v=1724484357&width=600",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${dmSans.variable}`}>
      <body className="w-full min-h-screen bg-chummy-cream text-chummy-plum antialiased selection:bg-chummy-yellow selection:text-chummy-plum font-sans">
        {children}
      </body>
    </html>
  );
}
