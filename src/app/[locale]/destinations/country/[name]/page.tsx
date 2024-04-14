import React from "react";
import Image from "next/image";
import Loading from "@/app/components/Country/Loading";
import { getTranslations } from "next-intl/server";
import { capitalizeFirstLetter } from "@/app/utils/capitalizeFirstLetter";
import spain from "@/app/assets/countries/Spain.jpg";
import portugal from "@/app/assets/countries/Portugal.jpg";

type Props = {
  params: { name: number; locale: string };
};

const countryImages = {
  es: spain,
  pt: portugal,
};

async function fetchCountryInfo(name: number) {
  try {
    const response = await fetch(`https://triploro.es/api/v1/country/${name}`, {
      headers: {
        revalidate: "3600",
        cache: "force-cache",
      },
    });
    const responseDestinations = await fetch(
      `https://triploro.es/api/v1/destination/${name}`,
      {
        headers: {
          revalidate: "3600",
          cache: "force-cache",
        },
      }
    );
    const destinations = await responseDestinations.json();
    const country = await response.json();
    return {
      ...country,
      destinations,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { name, locale } = params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const country = await fetchCountryInfo(name);

  if (!country) {
    return {
      title: "Country not found",
      description: "Country not found",
    };
  }

  return {
    title: t(`Country.${country.name}`),
    description: t("Country.description"),
  };
}

export default async function CountryPage({ params }: Props) {
  const { name } = params;

  const t = await getTranslations("Country");
  const country = await fetchCountryInfo(name);
  const destinations = country?.destinations;

  if (!country) {
    return <Loading />;
  }
  const destinationsNameCapitalized = destinations.map(
    (destination: any) =>
      destination.name.charAt(0).toUpperCase() + destination.name.slice(1)
  );

  const countryNameCapitalized = capitalizeFirstLetter(country.name);
  const continentNameCapitalized = capitalizeFirstLetter(country.continent);

  const countryName = t(`Countries.${countryNameCapitalized}`);
  const continentName = t(`Information.${continentNameCapitalized}`);
  const countryDescription = t(`Description.${countryNameCapitalized}`);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mt-8 md:mt-16">
          <h2 className="text-lg lg:text-3xl font-semibold bg-blue px-2 py-1 text-white rounded-md shadow-md">
            {countryName}
          </h2>
          <h2 className="text-sm lg:text-1xl font-semibold bg-blue px-2 py-1 text-white rounded-md shadow-md">
            {continentName}
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={countryImages[country.image as keyof typeof countryImages]}
              width={500}
              height={400}
              alt={countryNameCapitalized}
              placeholder="blur"
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="prose prose-sky prose-lg text-gray-800 mt-5 md:mt-0">
            {countryDescription}
          </div>
        </div>
        <h2 className="text-lg lg:text-2xl w-fit font-semibold bg-blue px-2 py-1 mt-10 text-white rounded-md shadow-md">
          {t("Information.Destine")}
        </h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:flex">
          {destinationsNameCapitalized.map(
            (destinationName: string, index: number) => (
              <div
                key={index}
                className="text-gray-700 font-medium bg-white w-full h-fit sm:w-auto p-3 rounded shadow-md hover:shadow-md cursor-pointer transition duration-300 ease-in-out hover:bg-blue hover:text-white text-center md:text-start"
              >
                {t(`Cities.${destinationName}`)}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
