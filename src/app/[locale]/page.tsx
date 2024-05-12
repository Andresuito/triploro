import { getTranslations } from "next-intl/server";
import Hero from "@/app/components/Hero";
import Grid from "@/app/components/Grid";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Title"),
    description: t("Description"),
  };
}

export default function Home() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 text-gray-800 mb-10">
        <Hero />
        <Grid />
      </div>
    </>
  );
}
