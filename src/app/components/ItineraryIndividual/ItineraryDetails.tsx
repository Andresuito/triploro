import React, { useEffect, useState } from "react";
import { formatRangeDate } from "@/app/utils/formatDate";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";
import { ImageUpload } from "@/app/components/ItineraryIndividual/ImageUpload";
import { PrivateOrPublic } from "@/app/components/ItineraryIndividual/PrivateOrPublic";
import { ItineraryDetailsDays } from "@/app/components/ItineraryIndividual/ItineraryDetailsDays";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { get } from "http";

const ItineraryDetails = ({
  itinerary,
  isPublic,
  previewUrl,
  setPreviewUrl,
  showUpload,
  setShowUpload,
  setItinerary,
  handleStatusChange,
}: {
  itinerary: any;
  isPublic: any;
  previewUrl: any;
  setPreviewUrl: any;
  showUpload: any;
  setShowUpload: any;
  setItinerary: any;
  handleStatusChange: any;
}) => {
  const { data: session } = useSession();
  const t = useTranslations("Itinerary");
  const c = useTranslations("Country.Cities");

  const [titleText, setTitleText] = useState("");
  const [addressText, setAddressText] = useState("");
  const [invitations, setInvitations] = useState<{ [key: number]: string[] }>(
    {}
  );

  const waitForElement = (selector: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const observer = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          if (document.querySelector(selector)) {
            resolve();
            observer.disconnect();
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  };

  const getInvitations = async (itineraryId: any) => {
    try {
      if (session?.user?.id) {
        const response = await axiosInstance.get(
          `/invitation/invitations/${itineraryId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data)) {
          const initials = response.data.map((invitation) =>
            invitation.username[0].toUpperCase()
          );
          setInvitations((prev) => ({ ...prev, [itineraryId]: initials }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInvitations(itinerary.id);
  }, [itinerary.id]);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="align-middle w-auto md:min-w-96">
          <div className="flex justify-center relative">
            <SafeImage
              src={
                previewUrl
                  ? previewUrl
                  : itinerary.imageUrl
                  ? `${process.env.NEXT_PUBLIC_API_URL}${itinerary.imageUrl}`
                  : NotImage
              }
              alt={itinerary.city ? itinerary.city : ""}
              width={400}
              height={300}
              className="h-[300px] w-full md:max-w-[384px] object-cover rounded-t-1xl opacity-90"
            />
            {itinerary.isOwner && (
              <>
                <p
                  className="absolute bottom-1 right-1 text-xs text-white hover:bg-blue p-1 cursor-pointer rounded-md"
                  onClick={() => setShowUpload(true)}
                >
                  {t("Buttons.NewImage")}
                </p>
                <p
                  className={`absolute bottom-1 left-1 text-xs text-white p-1 px-2 rounded ${
                    isPublic ? "bg-blue" : "bg-red-500"
                  }`}
                >
                  {isPublic ? t("isPublic") : t("isPrivate")}
                </p>
              </>
            )}
            <ImageUpload
              itineraryCode={itinerary.code}
              showUpload={showUpload}
              setShowUpload={setShowUpload}
              setPreviewUrl={setPreviewUrl}
              setItinerary={setItinerary}
            />
          </div>
          <div className="p-5 rounded-b-1xl shadow-xl">
            <div className="flex justify-between items-center">
              <p className="text-3xl text-blue font-semibold">
                {c(itinerary.city) || itinerary.city}
              </p>
              <p className="p-1 px-1 text-xs bg-blue text-white w-fit rounded-md">
                {itinerary.code}
              </p>
            </div>
            <div
              className={`flex mt-6 text-1xl text-center text-blue justify-between items-center ${
                !itinerary.startDate || !itinerary.endDate ? "" : "space-x-20"
              }`}
            >
              <div
                className={`flex flex-col ${
                  !itinerary.startDate || !itinerary.endDate ? "hidden" : ""
                }`}
              >
                <p>
                  {
                    formatRangeDate(
                      itinerary.startDate,
                      itinerary.endDate
                    ).split(" ")[0]
                  }
                </p>
                <p className="-mt-2">
                  {
                    formatRangeDate(
                      itinerary.startDate,
                      itinerary.endDate
                    ).split(" ")[1]
                  }
                </p>
              </div>
              <div className="flex flex-col">
                <p>{itinerary.days}</p>
                <p className="-mt-2">{t("Days")}</p>
              </div>
              <div className="flex space-x-1">
                {invitations[itinerary.id] &&
                  invitations[itinerary.id].map((initial, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 bg-blue rounded-full flex items-center justify-center"
                    >
                      <span className="text-white">{initial}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:ml-12 h-fit justify-between flex flex-grow flex-col">
          <div className="flex items-center justify-between">
            <p className="text-3xl text-blue font-semibold">
              {c(itinerary.city) || itinerary.city}
            </p>
            {itinerary.isOwner && (
              <>
                <PrivateOrPublic
                  info={{ isPublic: itinerary.public }}
                  itineraryCode={itinerary.code}
                  onStatusChange={handleStatusChange}
                />
              </>
            )}
          </div>
          <div className="flex mt-2">
            <APIProvider apiKey="AIzaSyCEE3re4DPmczgHsFzZveMsdg2ATl54iZo">
              <Map
                className="w-full h-[395px] rounded-1xl"
                defaultCenter={{
                  lat: parseFloat(itinerary.latitude),
                  lng: parseFloat(itinerary.longitude),
                }}
                defaultZoom={13}
                gestureHandling={"greedy"}
                disableDefaultUI={false}
                onClick={async (event) => {
                  await waitForElement('div[role="dialog"] .address');
                  const addressElement = document.querySelector(
                    'div[role="dialog"] .address'
                  );
                  await waitForElement('div[role="dialog"] .gm-title');
                  const titleElement = document.querySelector(
                    'div[role="dialog"] .gm-title'
                  );

                  if (titleElement) {
                    setTitleText(titleElement.textContent || "");
                  }
                  if (addressElement) {
                    setAddressText(addressElement.textContent || "");
                  }
                }}
              ></Map>
            </APIProvider>
          </div>
        </div>
      </div>
      <ItineraryDetailsDays
        itinerary={itinerary}
        addressText={addressText}
        titleText={titleText}
      />
    </>
  );
};

export default ItineraryDetails;
