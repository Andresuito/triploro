"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";
import { Country } from "@/types/country";
import { capitalizeFirstLetter } from "@/app/utils/capitalizeFirstLetter";
import Image from "next/image";
import spain from "@/app/assets/countries/Spain.jpg";
import portugal from "@/app/assets/countries/Portugal.jpg";
import CountryInfoSkeleton from "./CountryInfoSkeleton";

const countryImages = {
  es: spain,
  pt: portugal,
};

const CountryInfo = ({ id }: { id: number }) => {
  const [country, setCountry] = useState<Country | null>(null);
  const t = useTranslations("Country");

  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await axiosInstance.get(`/country/${id}`);
        setCountry(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    getCountry();
  }, [id]);

  if (!country) {
    return <CountryInfoSkeleton />;
  }

  const countryNameCapitalized = capitalizeFirstLetter(country.name);
  const capitalNameCapitalized = capitalizeFirstLetter(country.capital);
  const continentNameCapitalized = capitalizeFirstLetter(country.continent);

  return (
    <>
      <div className="flex justify-between items-center mt-8 md:mt-16">
        <h2 className="text-lg lg:text-3xl font-semibold bg-sky-900 px-2 py-1 text-white rounded-md">
          {t(`Countries.${countryNameCapitalized}`)}
        </h2>
        <h2 className="text-sm lg:text-1xl font-semibold bg-sky-900 px-2 py-1 text-white rounded-md">
          {t(`Information.${continentNameCapitalized}`)}
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
        <div>
          <p className="text-lg mb-4">
            {t(`Description.${countryNameCapitalized}`)}
          </p>
        </div>
      </div>
    </>
  );
};

export default CountryInfo;
