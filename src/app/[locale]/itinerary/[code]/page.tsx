"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SkeletonItinerary from "@/app/components/ItineraryIndividual/Skeleton";
import ItineraryDetails from "@/app/components/ItineraryIndividual/ItineraryDetails";

type Props = {
  params: { code: string; locale: string };
};

export default function Itinerary({ params }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const getItinerary = async () => {
      setIsLoading(true);
      try {
        let response;

        if (session?.user?.token) {
          try {
            response = await axiosInstance.get(`/itinerary/${params.code}`, {
              headers: {
                Authorization: `Bearer ${session.user.token}`,
              },
            });
          } catch (privateError: any) {
            if (privateError.response && privateError.response.status === 403) {
              response = await axiosInstance.get(
                `/itinerary/public/${params.code}`
              );
            } else {
              throw privateError;
            }
          }
        } else {
          response = await axiosInstance.get(
            `/itinerary/public/${params.code}`
          );
        }

        if (response.status === 200 && response.data) {
          setItinerary(response.data);
          setIsPublic(response.data.public);
        }
      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getItinerary();
  }, [params.code, router, session?.user?.token]);

  const handleStatusChange = (newStatus: boolean) => {
    setIsPublic(newStatus);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 mt-8 md:mt-16">
      {isLoading ? (
        <SkeletonItinerary />
      ) : (
        itinerary && (
          <ItineraryDetails
            itinerary={itinerary}
            isPublic={isPublic}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            setItinerary={setItinerary}
            handleStatusChange={handleStatusChange}
          />
        )
      )}
    </div>
  );
}
