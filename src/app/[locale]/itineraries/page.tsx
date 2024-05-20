"use client";

import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Link from "next/link";
import axiosInstance from "@/app/utils/axiosInstance";
import { Itinerary } from "@/types/itineraryType";

import FavoriteItinerary from "@/app/components/Itinerary/FavoriteItinerary";

import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";

import Button from "@/app/components/Global/Button";
import Spinner from "@/app/components/Global/Spinner";

export default function ItinerariesPublics() {
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getItineraries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/itinerary/allPublic");
      if (response.status === 200 && Array.isArray(response.data)) {
        const modifiedData = response.data.map((item) => ({
          ...item,
          height: `${Math.floor(Math.random() * 200) + 200}px`,
        }));
        setItineraries(modifiedData);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getItineraries();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const itineraryImages = itineraries.map((itinerary) => {
    if (itinerary.imageUrl) {
      return `https://triploro.es${itinerary.imageUrl}`;
    } else {
      return null;
    }
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-8 md:mt-16 flex justify-between items-center mb-8">
          <h2 className="text-base lg:text-2xl font-semibold text-gray-900 ">
            Todos nuestros{" "}
            <span className="bg-blue px-2 py-2 text-white rounded-1xl">
              Itinerarios
            </span>
          </h2>

          <Link
            href="/new"
            className="text-sm lg:text-base underline underline-offset-4 hover:bg-blue align-top px-2 py-2 hover:no-underline rounded-1xl duration-300 transition hover:text-white"
          >
            Crear Itinerario
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {itineraries.map((itinerary: Itinerary, index: number) => {
              return (
                <Link
                  href={`/itinerary/${itinerary.code}`}
                  key={itinerary.code}
                  legacyBehavior
                  className="pointer-events-none"
                >
                  <div
                    key={itinerary.id}
                    className="group rounded-1xl text-white p-4 text-center mb-4 overflow-hidden relative "
                    style={{
                      height: itinerary.height,
                    }}
                  >
                    <SafeImage
                      src={
                        itineraryImages[index]
                          ? `${itineraryImages[index]}?${new Date().getTime()}`
                          : NotImage.src
                      }
                      alt={itinerary.city}
                      fill
                      quality={70}
                      className="cursor-pointer opacity-75 rounded-1xl hover:opacity-100 transition-opacity duration-300 object-cover"
                    />
                    <div className="absolute text-white top-2 right-5 md:right-5">
                      <FavoriteItinerary code={itinerary.code} />
                    </div>
                    <div className="absolute top-2 left-2 bg-white rounded-full text-blue font-bold px-2 text-sm opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 select-none">
                      {itinerary.days} Dias
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-1 md:py-2 text-blue text-center opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 select-none">
                      <h3 className="text-base font-semibold mx-2">
                        {itinerary.city}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Masonry>
        )}
      </div>
    </div>
  );
}
