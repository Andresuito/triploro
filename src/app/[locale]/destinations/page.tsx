import React from "react";
import { getTranslations } from "next-intl/server";
import Map from "@/app/components/Map";
import Country from "@/app/components/Destinations/Country";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Destinations.Title"),
    description: t("Destinations.Description"),
  };
}

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 mb-10">
        {/* <div className="flex justify-between items-center mt-8 md:mt-16">
          <div>
            <h2 className="text-lg lg:text-2xl font-semibold text-gray-900">
              Destinos ofrecidos en{" "}
              <span className="bg-sky-900 px-2 py-1 text-white rounded-md">
                Triploro
              </span>
            </h2>
          </div>
        </div>

        <div className="relative">
          <Map />
        </div> */}

        <div className="mt-8 md:mt-16">
          <Country />
        </div>
      </div>
    </div>
  );
}
