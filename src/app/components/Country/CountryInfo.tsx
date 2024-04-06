"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";
import { Country } from "@/types/country";
import { capitalizeFirstLetter } from "@/app/utils/capitalizeFirstLetter";

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
    return <p>Cargando...</p>;
  }

  const countryNameCapitalized = capitalizeFirstLetter(country.name);
  const capitalNameCapitalized = capitalizeFirstLetter(country.capital);
  const continentNameCapitalized = capitalizeFirstLetter(country.continent);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>{t(`Countries.${countryNameCapitalized}`)}</p>
        <p>{t(`Description.${countryNameCapitalized}`)}</p>
        <p>
          {t("Information.Capital")}: {t(`Cities.${capitalNameCapitalized}`)}
        </p>
        <p>
          {t("Information.Continent")}:{" "}
          {t(`Information.${continentNameCapitalized}`)}
        </p>
      </div>
    </div>
  );
};

export default CountryInfo;
