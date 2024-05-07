import { getTranslations } from "next-intl/server";

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
      <p>Hola, prueba</p>
    </>
  );
}
