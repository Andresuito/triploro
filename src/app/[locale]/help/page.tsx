import React from "react";
import { getTranslations } from "next-intl/server";
import Guides from "@/app/components/Help/Guides";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Help.Title"),
    description: t("Help.Description"),
  };
}

const HelpPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Guides />
      </div>
    </div>
  );
};

export default HelpPage;
