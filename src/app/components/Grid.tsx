"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { animated, useTransition } from "react-spring";

import madrid from "@/app/assets/madrid.jpg";
import barcelona from "@/app/assets/barcelona.jpg";
import lisboa from "@/app/assets/lisboa.jpg";
import oporto from "@/app/assets/oporto.jpg";
import sevilla from "@/app/assets/sevilla.jpg";
import valencia from "@/app/assets/valencia.jpg";

const destinos = [
  {
    nombre: "Cities.Seville",
    pais: "Countries.Spain",
    imagen: sevilla,
    className: "rounded-md w-full h-80 object-cover object-top",
  },
  {
    nombre: "Cities.Barcelona",
    pais: "Countries.Spain",
    imagen: barcelona,
    className: "rounded-md w-full h-80 object-cover",
  },
  {
    nombre: "Cities.Lisbon",
    pais: "Countries.Portugal",
    imagen: lisboa,
    className: "rounded-md w-full h-80 object-cover",
  },
  {
    nombre: "Cities.Madrid",
    pais: "Countries.Spain",
    imagen: madrid,
    className: "rounded-md w-full h-80 object-cover",
  },
  {
    nombre: "Cities.Porto",
    pais: "Countries.Portugal",
    imagen: oporto,
    className: "rounded-md w-full h-80 object-cover",
  },
  {
    nombre: "Cities.Valencia",
    pais: "Countries.Spain",
    imagen: valencia,
    className: "rounded-md w-full h-80 object-cover",
  },
];

export default function DestinosPopulares() {
  const t = useTranslations("Destination");

  const destinosTranslatable = destinos.map((destino) => ({
    ...destino,
    nombre: t(destino.nombre),
    pais: t(destino.pais),
  }));

  const transitions = useTransition(destinosTranslatable, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold mb-8 mt-5">
        {t("Titles.PopularDestinations")}
      </h2>
      <div className="grid justify-center md:justify-center lg:justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 popular-countries">
        {transitions((style, item, key) => (
          <animated.div style={style} className="relative group">
            <Image
              src={item.imagen}
              alt={`${item.nombre}, ${item.pais}`}
              placeholder="blur"
              className={item.className}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-1 md:py-2 text-blue text-center opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
              <h3 className="text-lg font-semibold mx-2">{item.nombre}</h3>
              <p className="text-xs">{item.pais}</p>
            </div>
          </animated.div>
        ))}
      </div>
    </>
  );
}
