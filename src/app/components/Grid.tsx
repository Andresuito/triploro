import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import madrid from "@/app/assets/madrid.jpg";
import barcelona from "@/app/assets/barcelona.jpg";
import lisboa from "@/app/assets/lisboa.jpg";
import oporto from "@/app/assets/oporto.jpg";
import sevilla from "@/app/assets/sevilla.jpg";
import valencia from "@/app/assets/valencia.jpg";

export default function DestinosPopulares() {
  const t = useTranslations("Destination");

  const destinos = [
    {
      nombre: t("Cities.Seville"),
      pais: t("Countries.Spain"),
      imagen: sevilla,
      className: "rounded-md w-full h-80 object-cover object-top",
    },
    {
      nombre: t("Cities.Barcelona"),
      pais: t("Countries.Spain"),
      imagen: barcelona,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("Cities.Lisbon"),
      pais: t("Countries.Portugal"),
      imagen: lisboa,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("Cities.Madrid"),
      pais: t("Countries.Spain"),
      imagen: madrid,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("Cities.Porto"),
      pais: t("Countries.Portugal"),
      imagen: oporto,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("Cities.Valencia"),
      pais: t("Countries.Spain"),
      imagen: valencia,
      className: "rounded-md w-full h-80 object-cover",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 text-gray-800 mb-10">
      <h2 className="text-2xl font-semibold mb-8 mt-5">
        {t("Titles.PopularDestinations")}
      </h2>
      <div className="grid justify-center md:justify-center lg:justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinos.map((destino, index) => (
          <div key={index} className="relative group">
            <Image
              src={destino.imagen}
              alt={`${destino.nombre}, ${destino.pais}`}
              placeholder="blur"
              className={destino.className}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-1 md:py-2 text-sky-900 text-center opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
              <h3 className="text-lg font-semibold mx-2">{destino.nombre}</h3>
              <p className="text-xs">{destino.pais}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
