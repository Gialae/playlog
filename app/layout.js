import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWrapper from "./components/ChatWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PLAYLOG",
  description: "Il tuo diario di gioco personale",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ChatWrapper />
      </body>
    </html>
  )
}