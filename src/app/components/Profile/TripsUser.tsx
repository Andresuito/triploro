import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";

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
            className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden relative"
          >
            <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full  flex items-center justify-center">
              <FaTrash className="text-base text-blue/50 hover:text-blue/100 cursor-pointer duration-200 transition" />
            </div>
            <div className="flex-shrink-0">
              {/* <img
            className="h-48 w-full object-cover"
            src="/images/trip.jpg"
            alt={trip.city}
          /> */}
            </div>
            <div className="p-6 text-gray-500 text-base *:mt-2">
              <h2 className="text-2xl font-bold leading-7 text-blue sm:text-3xl sm:truncate">
                {trip.city}
              </h2>
              <p>Days: {trip.days}</p>
              <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-base">No hay itinerarios disponibles.</p>
      )}
    </div>
  );
}
