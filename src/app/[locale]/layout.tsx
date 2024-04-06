import "./globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SessionAuthProvider from "@/app/context/SessionAuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Triploro",
    template: "%s - Triploro",
  },
  description:
    "Triploro es una plataforma que te permite organizar tus viajes de una manera sencilla y rápida.",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionAuthProvider>
            <Navbar />
            <Toaster position="bottom-right" />
            {children}
            <Footer />
          </SessionAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
