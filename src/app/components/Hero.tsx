"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/app/components/Global/Button";
import Link from "next/link";
import { animated, useTransition } from "react-spring";
import { useTranslations } from "next-intl";
import bg_hero from "@/app/assets/banner-hero.jpg";
import bg_hero_2 from "@/app/assets/banner-hero-2.png";
import bg_hero_3 from "@/app/assets/banner-hero-3.png";
import bg_hero_4 from "@/app/assets/banner-hero-4.png";

export default function Hero() {
  const t = useTranslations("Hero");
  const [bgImage, setBgImage] = useState(bg_hero);

  useEffect(() => {
    const bgImages = [bg_hero, bg_hero_2, bg_hero_3, bg_hero_4];
    const interval = setInterval(() => {
      setBgImage((currentImage) => {
        const currentIndex = bgImages.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % bgImages.length;
        return bgImages[nextIndex];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const transitions = useTransition(bgImage, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <div className="relative h-[350px] md:h-[550px] flex items-center justify-center">
      {transitions((style, item) => (
        <animated.div style={style} className="absolute inset-0">
          <Image
            src={item}
            alt="Background"
            className="object-cover rounded-1xl"
            placeholder="blur"
            fill
          />
        </animated.div>
      ))}
      <div className="absolute rounded-1xl inset-0 bg-gradient-to-b from-blue/50 from-50% to-blue/10 to-100% "></div>
      <div className="text-white p-2 md:p-0 text-center z-10">
        <h1 className="text-2xl md:text-4xl mt-16 font-bold mb-4">
          {t("Title")}
        </h1>
        <p className="text-base md:text-lg mb-8">{t("Subtitle")}</p>
        <div className="space-x-5 align-bottom">
          <Link href="/itineraries">
            <Button
              className="w-[180px] hover:scale-105 transition duration-150"
              label={t("Buttons.ExploreItinerary")}
            />
          </Link>
          <Link href="/new">
            <Button
              className="w-[180px] hover:scale-105 transition duration-150"
              label={t("Buttons.CreateItinerary")}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
