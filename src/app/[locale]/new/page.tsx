import React from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import background_itinerary from "@/app/assets/background-itinerary.png";
import NewItinerary from "@/app/components/New/NewItinerary";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("New.Title"),
    description: t("New.Description"),
  };
}

export default async function HelpPage() {
  const t = await getTranslations("New");

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative text-white flex flex-col items-start justify-center h-full select-none">
            <Image
              src={background_itinerary}
              className="w-full rounded-1xl"
              alt="background itinerary"
              placeholder="blur"
            />
            <h1 className="absolute  top-0 text-lg sm:text-2xl mt-8 pl-8 md:mt-14 md:pl-12 md:text-2xl">
              {t("Title")}
            </h1>
            <div className="absolute top-0 left-0 flex-col flex items-start justify-center h-full w-full pl-8 md:p-12">
              <h2 className="text- md:text-4xl font-semibold max-w-[399px]">
                {t("Subtitle")}
              </h2>
              <p className="text-base mt-3">{t("Subtitle2")}</p>
            </div>
            <Link href="/help" legacyBehavior>
              <a className="absolute bottom-0 underline underline-offset-4 ml-8 mb-8 md:mb-12 md:ml-12 hover:bg-blue align-top px-3 hover:no-underline rounded-1xl duration-300 transition">
                {t("ReadMore")}{" "}
              </a>
            </Link>
            <div className="absolute hidden xl:inline-block top-0 right-0 mt-14">
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mr-12">
                <h1 className="text-2xl"> {t("Setps.TitleStep1")}</h1>
                <p className="text-sm mt-[10px]">{t("Setps.InfoStep1")}</p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl"> {t("Setps.TitleStep2")}</h1>
                <p className="text-sm mt-[10px]">{t("Setps.InfoStep2")}</p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl"> {t("Setps.TitleStep3")}</h1>
                <p className="text-sm mt-[10px]">{t("Setps.InfoStep3")}</p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl"> {t("Setps.TitleStep4")}</h1>
                <p className="text-sm mt-[10px]">{t("Setps.InfoStep4")}</p>
              </div>
            </div>
          </div>
          <NewItinerary />
        </div>
      </div>
    </>
  );
}
