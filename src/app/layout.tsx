import { NextIntlClientProvider, useMessages } from "next-intl";

export async function generateMetadata() {
  return {
    title: "Triploro - 404",
    description: "The best travel website",
    icons: {
      icon: "/favicon.svg",
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
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
