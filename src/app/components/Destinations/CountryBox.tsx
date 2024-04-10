import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { capitalizeFirstLetter } from "@/app/utils/capitalizeFirstLetter";

import spain from "@/app/assets/countries/Spain.jpg";
import portugal from "@/app/assets/countries/Portugal.jpg";

const countryImages = {
  es: spain,
  pt: portugal,
};

export const CountryBox = ({ country }: { country: any }) => {
  const t = useTranslations("Destination.Countries");
  const imageWidth = 450;
  const imageHeight = 320;

  const countryNameCapitalized = capitalizeFirstLetter(country.name);

  const countryImage =
    countryImages[country.image as keyof typeof countryImages];

  return (
    <Link href={`/destinations/country/${country.name}`} legacyBehavior>
      <a className="relative cursor-pointer hover:shadow-lg transition duration-500">
        <Image
          src={countryImage}
          alt={country.name}
          width={imageWidth}
          height={imageHeight}
          placeholder="blur"
          className="rounded-md w-full h-60 object-cover object-bottom"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-1 md:py-4 text-sky-900 text-center opacity-100">
          <h3 className="text-lg font-semibold mx-2">
            {t(countryNameCapitalized)}
          </h3>
        </div>
      </a>
    </Link>
  );
};
