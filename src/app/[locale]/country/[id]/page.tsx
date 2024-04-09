import React from "react";
import Image from "next/image";
import CountryInfoSkeleton from "@/app/components/Country/CountryInfoSkeleton";
import { getTranslations } from "next-intl/server";
import { capitalizeFirstLetter } from "@/app/utils/capitalizeFirstLetter";
import spain from "@/app/assets/countries/Spain.jpg";
import portugal from "@/app/assets/countries/Portugal.jpg";

type Props = {
  params: { id: number; locale: string };
};

const countryImages = {
  es: spain,
  pt: portugal,
};

async function fetchCountryInfo(id: number) {
  try {
    const response = await fetch(`https://triploro.es/api/v1/country/${id}`, {
      headers: {
        revalidate: "3600",
        cache: "force-cache",
      },
    });
    const country = await response.json();
    return country;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id, locale } = params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const country = await fetchCountryInfo(id);

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
  const { id } = params;

  const t = await getTranslations("Country");
  const country = await fetchCountryInfo(id);

  if (!country) {
    return <CountryInfoSkeleton />;
  }

  const countryNameCapitalized = capitalizeFirstLetter(country.name);
  const continentNameCapitalized = capitalizeFirstLetter(country.continent);

  const countryName = t(`Countries.${countryNameCapitalized}`);
  const continentName = t(`Information.${continentNameCapitalized}`);
  const countryDescription = t(`Description.${countryNameCapitalized}`);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mt-8 md:mt-16">
          <h2 className="text-lg lg:text-3xl font-semibold bg-sky-900 px-2 py-1 text-white rounded-md">
            {countryName}
          </h2>
          <h2 className="text-sm lg:text-1xl font-semibold bg-sky-900 px-2 py-1 text-white rounded-md">
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
              className="rounded-lg"
            />
          </div>
          <div>{countryDescription}</div>
        </div>
      </div>
    </div>
  );
}
