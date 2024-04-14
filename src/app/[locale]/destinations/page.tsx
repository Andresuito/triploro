import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
// import Map from "@/app/components/Map";
import { CountryBox } from "@/app/components/Destinations/CountryBox";
import { Country } from "@/types/country";
import Loading from "@/app/components/Destinations/Loading";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Destinations.Title"),
    description: t("Destinations.Description"),
  };
}

async function getDestinations() {
  const response = await fetch("https://triploro.es/api/v1/country/all", {
    headers: {
      revalidate: "3600",
      cache: "force-cache",
    },
  });
  const destinations = await response.json();
  return destinations;
}

export default async function DestinationsPage() {
  const t = await getTranslations("Destination");

  const countries = await getDestinations();

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
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-8">
            {t("Titles.CurrentDestinations")}{" "}
            <span className="bg-blue px-2 py-1 text-white rounded-md">
              {t("Titles.Destination")}
            </span>
          </h2>
          <Suspense fallback={<Loading />}>
            <div className="grid justify-center md:justify-center lg:justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country: Country) => (
                <CountryBox key={country.id} country={country} />
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
