import React, { useEffect, useState } from "react";
import { Trip } from "@/types/Trip";
import axiosInstance from "@/app/utils/axiosInstance";
import { formatRangeDate } from "@/app/utils/formatDate";
import { FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Spinner from "@/app/components/Global/Spinner";
import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";
import ModalWindow from "@/app/components/ModalWindow";
import Button from "@/app/components/Global/Button";
import Toast from "@/app/components/Global/Toast";

export default function TripsUser() {
  const t = useTranslations("Profile");
  const c = useTranslations("Country.Cities");
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

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

  const deleteTrip = async () => {
    if (tripToDelete) {
      const response = await axiosInstance.delete(
        "/itinerary/" + tripToDelete.code,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        Toast({ message: "Itinerario borrado correctamente", isError: false });
        setTrips(trips.filter((trip) => trip.code !== tripToDelete.code));
        setTripToDelete(null);
        setShowModal(false);
      }
    }
  };

  useEffect(() => {
    getTrips();
  }, [session]);

  const tripImages = trips.map((trip) => {
    if (trip.imageUrl) {
      return `${process.env.NEXT_PUBLIC_API_URL}${trip.imageUrl}`;
    } else {
      return null;
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {showModal && (
        <ModalWindow
          open={showModal}
          onClose={() => setShowModal(false)}
          title={t("Modal.Title") + (tripToDelete ? tripToDelete.city : "")}
          content={
            <div>
              <h1>{t("Modal.Question")}</h1>
              <div className="flex mt-2 space-x-3">
                <Button
                  label={t("Modal.Buttons.Delete")}
                  className="w-full bg-red-500 opacity-50 hover:opacity-100 text-white"
                  onClick={deleteTrip}
                />
                <Button
                  label={t("Modal.Buttons.Cancel")}
                  className="w-full opacity-50 hover:opacity-100"
                  onClick={() => setShowModal(false)}
                />
              </div>
            </div>
          }
        />
      )}
      {trips.length > 0 ? (
        trips.map((trip: Trip, index: number) => (
          <Link href={`/itinerary/${trip.code}`} key={trip.id} legacyBehavior>
            <a className="flex flex-row h-[137px] bg-white drop-shadow-lg rounded-1xl overflow-hidden relative transition duration-300 ease-in-out transform hover:scale-105 hover:drop-shadow-xl">
              <div className="p-4 text-gray-500 text-base flex-grow">
                <div className="flex items-center">
                  <p className="text-2xl font-bold leading-7 text-blue cursor-pointer">
                    {c(trip.city) || trip.city}
                  </p>
                </div>
                <div className="flex space-x-5">
                  <p className="text-blue">
                    {formatRangeDate(trip.startDate, trip.endDate)}
                  </p>
                  <p>
                    {trip.days} {t("TripInfo.Days")}
                  </p>
                </div>
              </div>
              <div
                className="flex-shrink-0 mr-4 cursor-pointer pt-4"
                onClick={(e) => {
                  e.preventDefault();
                  setTripToDelete(trip);
                  setShowModal(true);
                }}
              >
                <FaTrash className="text-base text-red-400 hover:text-red-500" />
              </div>
              <div className="flex-shrink-0 drop-shadow-lg">
                <SafeImage
                  src={tripImages[index] ? `${tripImages[index]}` : NotImage}
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
        <p className="text-base">{t("TripInfo.NoItinerary")}</p>
      )}
    </div>
  );
}
