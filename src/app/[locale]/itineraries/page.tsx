"use client";

import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/Global/Button";

import Lisboa from "@/app/assets/lisboa.jpg";
import Barcelona from "@/app/assets/barcelona.jpg";
import Madrid from "@/app/assets/madrid.jpg";
import Sevilla from "@/app/assets/sevilla.jpg";
import Valencia from "@/app/assets/valencia.jpg";
import Oporto from "@/app/assets/oporto.jpg";

export default function BetterExample() {
  const items = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    name: `Itinerario ${index + 1}`,
    height: `${Math.floor(Math.random() * 200) + 100}px`,
    image: [Lisboa, Barcelona, Madrid, Sevilla, Oporto, Valencia][
      Math.floor(Math.random() * 6)
    ],
  }));

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-8 md:mt-16 flex justify-between items-start">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-8">
            Todos nuestros{" "}
            <span className="bg-blue px-2 py-1 text-white rounded-md">
              Itinerarios
            </span>
          </h2>

          <Link href="/new">
            {" "}
            <Button
              className="w-fit text-sm px-1 py-[2px] md:px-5 opacity-70 hover:opacity-100 duration-300 transition"
              label="Crear Itinerario"
            />
          </Link>
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-1xl text-white p-4 text-center mb-4"
              style={{
                position: "relative",
                height: item.height,
                overflow: "hidden",
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                placeholder="blur"
                quality={70}
                className="cursor-pointer opacity-75 rounded-1xl hover:opacity-100 transition-opacity duration-300 object-cover"
              />
              <div className="absolute bg-blue p-1 rounded-1xl">
                {item.name}
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
}
