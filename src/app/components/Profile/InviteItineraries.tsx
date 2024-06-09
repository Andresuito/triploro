import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axiosInstance from "@/app/utils/axiosInstance";
import Spinner from "@/app/components/Global/Spinner";

interface Trip {
  id: string;
  invitedBy: string;
  itinerary: {
    id: string;
    city: string;
    days: number;
    code: string;
  };
}

export default function InviteItineraries() {
  const { data: session } = useSession();
  const t = useTranslations("Profile");
  const c = useTranslations("Country.Cities");
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [acceptedTrips, setAcceptedTrips] = useState<Trip[]>([]);

  const getInviteItineraries = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const response = await axiosInstance.get<Trip[]>(
          "/invitation/invites/" + session?.user?.id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          setTrips(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const acceptInvite = async (tripId: string) => {
    try {
      const response = await axiosInstance.post(
        "/invitation/accept",
        {
          invitationId: tripId,
          userId: session?.user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );

      if (response.status === 200) {
        getInviteItineraries();
        getAcceptedInvitations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelInvite = async (tripId: string) => {
    try {
      const response = await axiosInstance.post(
        "/invitation/reject",
        {
          invitationId: tripId,
          userId: session?.user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );

      if (response.status === 200) {
        getInviteItineraries();
        getAcceptedInvitations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAcceptedInvitations = async () => {
    try {
      if (session?.user?.id) {
        const response = await axiosInstance.get<Trip[]>(
          "/invitation/itinerary/" + session?.user?.id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          setAcceptedTrips(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInviteItineraries();
    getAcceptedInvitations();
  }, [session]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {trips.length > 0 ? (
          trips.map((trip: Trip) => (
            <div
              key={trip.id}
              className="box bg-white shadow-md rounded-1xl px-8 pt-6 pb-8 mb-4 transition duration-300 ease-in-out transform  hover:scale-105 hover:drop-shadow-xl"
            >
              <h2 className="font-bold text-xl mb-2">
                {`${trip.itinerary.city}`} - {`${trip.itinerary.days}`}{" "}
                {t("TripInfo.Days")}
              </h2>

              <p>
                {t("InvitedBy")}{" "}
                <span className="text-blue font-semibold">
                  @{trip.invitedBy}
                </span>
              </p>

              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => acceptInvite(trip.id)}
                  className="bg-blue w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {t("Buttons.Accept")}
                </button>

                <button
                  onClick={() => cancelInvite(trip.id)}
                  className="bg-red-500 w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  {t("Buttons.Reject")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>{t("NoInvitations")}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {acceptedTrips.length > 0 ? (
          acceptedTrips.map((trip: Trip) => (
            <Link
              key={trip.itinerary.id}
              href={`/itinerary/${trip.itinerary.code}`}
              className="box bg-white shadow-md rounded-1xl px-8 pt-6 pb-8 mb-4 transition duration-300 ease-in-out transform  hover:scale-105 hover:drop-shadow-xl"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold leading-7 text-blue cursor-pointer">
                  {c(trip.itinerary.city)}
                </h1>
                <h2 className="text-gray-500">
                  {`${trip.itinerary.days}`} {t("TripInfo.Days")}
                </h2>
              </div>
              <p className="mt-2 text-sm">
                {t("CreatedBy")}{" "}
                <span className="text-blue font-semibold">
                  @{trip.invitedBy}
                </span>
              </p>
            </Link>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
