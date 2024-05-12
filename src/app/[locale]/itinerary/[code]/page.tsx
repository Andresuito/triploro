"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";

type Props = {
  params: { code: string; locale: string };
};

type ItineraryType = {
  id: number;
  code: string;
  city: string;
  days: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export default function Itinerary({ params }: Props) {
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null);

  useEffect(() => {
    const getItinerary = async () => {
      try {
        if (session?.user?.id) {
          const response = await axiosInstance.get(
            "/itinerary/" + params.code,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );

          if (response.status === 200 && response.data) {
            setItinerary(response.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getItinerary();
  }, [session, params.code]);

  return (
    <>
      {itinerary && (
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mt-8 md:mt-16 flex justify-between items-start">
              <h2 className="text-lg lg:text-2xl font-semibold bg-blue px-2 py-1 text-white rounded-md mb-8">
                {itinerary.city}
              </h2>
              <p className="text-sm lg:text-lg font-normal px-2 py-1 mb-8">
                Código: {itinerary.code}
              </p>
              <p className="text-sm lg:text-lg font-normal px-2 py-1 mb-8">
                Días: {itinerary.days}
              </p>
              <p className="text-sm lg:text-lg font-normal px-2 py-1 mb-8">
                Inicio: {itinerary.startDate}
              </p>
              <p className="text-sm lg:text-lg font-normal px-2 py-1 mb-8">
                Fin: {itinerary.endDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
