import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import axiosInstance from "@/app/utils/axiosInstance";
import CountryInfoComponent from "@/app/components/Country/CountryInfo";

type Props = {
  params: { id: number; locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const response = await axiosInstance.get(`/country/${id}`);
  const country = response.data;

  return {
    title: t(`Country.${country.name}`),
    description: t("Country.description"),
  };
}

export default function CountryPage({ params }: { params: { id: number } }) {
  const id = params.id;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CountryInfoComponent id={id} />
      </div>
    </div>
  );
}
