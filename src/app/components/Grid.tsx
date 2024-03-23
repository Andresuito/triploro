import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import madrid from "../assets/madrid.jpg";
import barcelona from "../assets/barcelona.jpg";
import lisboa from "../assets/lisboa.jpg";
import oporto from "../assets/oporto.jpg";
import sevilla from "../assets/sevilla.jpg";
import valencia from "../assets/valencia.jpg";

export default function DestinosPopulares() {
  const t = useTranslations("Destination");

  const destinos = [
    {
      nombre: t("City5"),
      pais: t("Country1"),
      imagen: sevilla,
      className: "rounded-md w-full h-80 object-cover object-top",
    },
    {
      nombre: t("City1"),
      pais: t("Country1"),
      imagen: barcelona,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("City3"),
      pais: t("Country2"),
      imagen: lisboa,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("City2"),
      pais: t("Country1"),
      imagen: madrid,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("City4"),
      pais: t("Country2"),
      imagen: oporto,
      className: "rounded-md w-full h-80 object-cover",
    },
    {
      nombre: t("City6"),
      pais: t("Country1"),
      imagen: valencia,
      className: "rounded-md w-full h-80 object-cover",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 text-gray-800 mb-10">
      <h2 className="text-2xl font-semibold mb-8 mt-5">{t("Title")}</h2>
      <div className="grid justify-center md:justify-center lg:justify-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinos.map((destino, index) => (
          <div key={index} className="relative group">
            <Image
              src={destino.imagen}
              alt={`${destino.nombre}, ${destino.pais}`}
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
