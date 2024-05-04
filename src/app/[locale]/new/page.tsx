import React from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import background_itinerary from "@/app/assets/background-itinerary.png";
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
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative text-white">
            <Image
              src={background_itinerary}
              className="w-full rounded-1xl"
              alt="background itinerary"
              placeholder="blur"
            />
            <h1 className="absolute mt-6">Hola</h1>
          </div>
          <NewItinerary />
        </div>
      </div>
    </>
  );
};

export default HelpPage;
