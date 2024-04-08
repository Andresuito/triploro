import "./globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import SessionAuthProvider from "@/app/context/SessionAuthProvider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Toaster } from "react-hot-toast";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");

  return {
    title: {
      default: t("Title"),
      template: "%s - Triploro",
    },
    description: t("Description"),
    metadataBase: new URL("https://triploro.com/"),
    openGraph: {
      type: "website",
      url: "https://triploro.com",
      site_name: t("Title"),
      images: [
        {
          url: "../opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: t("Title"),
        },
      ],
    },
  };
}

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
