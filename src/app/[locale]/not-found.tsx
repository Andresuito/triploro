import { useTranslations } from "next-intl";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "404",
  };
}

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-sky-900">
      <h1 className="text-9xl font-bold mb-4 text-sky-900">404</h1>
      <p className="text-2xl mb-4">{t("Description")}</p>
      <Link href="/" legacyBehavior>
        <a className="text-sky-800 text-lg hover:text-sky-950">{t("Link")}</a>
      </Link>
    </div>
  );
}
