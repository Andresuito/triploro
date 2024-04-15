import React from "react";
import { getTranslations } from "next-intl/server";
import NewItinerary from "@/app/components/New/NewItinerary";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("New.Title"),
    description: t("New.Description"),
  };
}

const HelpPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NewItinerary />
      </div>
    </div>
  );
};

export default HelpPage;
