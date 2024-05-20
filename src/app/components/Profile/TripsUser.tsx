import React, { useEffect, useState } from "react";
import { Trip } from "@/types/Trip";
import axiosInstance from "@/app/utils/axiosInstance";
import { formatRangeDate } from "@/app/utils/formatDate";
import { FaEllipsisH } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Spinner from "@/app/components/Global/Spinner";

import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";

export default function TripsUser() {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTrips = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const response = await axiosInstance.get(
          "/itinerary/user/" + session?.user?.id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          setTrips(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTrips();
  }, [session]);

  const tripImages = trips.map((trip) => {
    if (trip.imageUrl) {
      return `https://triploro.es${trip.imageUrl}`;
    } else {
      return null;
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {trips.length > 0 ? (
        trips.map((trip: Trip, index: number) => (
          <Link href={`/itinerary/${trip.code}`} key={trip.id} legacyBehavior>
            <a className="flex flex-row h-[137px] bg-white drop-shadow-lg rounded-1xl overflow-hidden relative transition duration-300 ease-in-out transform hover:scale-105 hover:drop-shadow-xl">
              <div className="p-4 text-gray-500 text-base flex-grow">
                <div className="flex items-center">
                  <p className="text-2xl font-bold leading-7 text-blue  cursor-pointer">
                    {trip.city}
                  </p>
                </div>
                <div className="flex space-x-5">
                  <p className="text-blue">
                    {formatRangeDate(trip.startDate, trip.endDate)}
                  </p>
                  <p>{trip.days} days</p>
                </div>
              </div>
              <div className="flex-shrink-0 mr-4 cursor-pointer pt-4">
                <FaEllipsisH className="text-base text-blue" />
              </div>
              <div className="flex-shrink-0 drop-shadow-lg">
                <SafeImage
                  src={
                    tripImages[index]
                      ? `${tripImages[index]}?${new Date().getTime()}`
                      : NotImage
                  }
                  alt={tripImages[index] ? trip.city : ""}
                  className="h-full w-24 object-cover"
                  width="500"
                  height="500"
                />
              </div>
            </a>
          </Link>
        ))
      ) : (
        <p className="text-base">No hay itinerarios disponibles.</p>
      )}
    </div>
  );
}
