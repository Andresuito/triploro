import React from "react";
import Image from "next/image";
import bg_hero from "@/app/assets/banner-hero.jpg";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="relative h-[500px] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={bg_hero}
          alt="Background"
          className="object-cover"
          placeholder="blur"
          fill
        />
      </div>
      <div className="absolute inset-0 bg-sky-900 opacity-70"></div>
      <div className="text-white p-2 md:p-0 text-center z-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{t("Title")}</h1>
        <p className="text-base md:text-lg mb-8">{t("Subtitle")}</p>
        <div className="max-w-md mx-auto">
          <input
            id="search"
            type="text"
            placeholder={t("Placeholder")}
            className="w-full px-4 py-2 rounded-full border-none shadow-md text-gray-800 focus:outline-none focus:ring focus:ring-sky-900"
          />
        </div>
      </div>
    </div>
  );
}
