import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { formatRangeDate } from "@/app/utils/formatDate";
import { FaEllipsisH } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Madrid from "@/app/assets/madrid.jpg";
import Image from "next/image";

type Trip = {
  id: number;
  code: string;
  city: string;
  days: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export default function TripsUser() {
  const { data: session } = useSession();

  const [trips, setTrips] = useState<Trip[]>([]);

  const getTrips = async () => {
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
  };

  useEffect(() => {
    getTrips();
  }, [session]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {trips.length > 0 ? (
        trips.map((trip: Trip) => (
          <div
            key={trip.id}
            className="flex flex-row h-[137px] bg-white drop-shadow-lg rounded-1xl overflow-hidden relative transition duration-300 ease-in-out transform hover:scale-105 hover:drop-shadow-xl"
          >
            <div className="p-4 text-gray-500 text-base *:mt-2 flex-grow">
              <div className="flex items-center">
                <Link
                  href={`/itinerary/${trip.code}`}
                  className="text-2xl font-bold leading-7 text-blue  cursor-pointer"
                >
                  {trip.city}
                </Link>
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
            <div className="flex-shrink-0 drop-shadow-lg bg-gray-600">
              <Image
                className="h-full w-24 object-cover"
                src={Madrid}
                alt={trip.city}
                onError={(e) => {
                  (e.target as any).onerror = null;
                  (e.target as any).style.backgroundColor = "gray";
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-base">No hay itinerarios disponibles.</p>
      )}
    </div>
  );
}
