"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useTranslations } from "next-intl";
import { CountryBox } from "./CountryBox";
import { Country as CountryType } from "@/types/country";

export const Country = () => {
  const t = useTranslations("Destination");
  const [countries, setCountries] = useState<CountryType[]>([]);

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const response = await axiosInstance.get("/country/all", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCountries(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    getDestinations();
  }, []);

  return (
    <>
      <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-8">
        {t("Titles.CurrentDestinations")}{" "}
        <span className="bg-sky-900 px-2 py-1 text-white rounded-md">
          {t("Titles.Destination")}
        </span>
      </h2>
      <div className="grid justify-center md:justify-center lg:justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => (
          <CountryBox key={country.id} country={country} />
        ))}
      </div>
    </>
  );
};

export default Country;
