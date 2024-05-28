import React from "react";
import { formatRangeDate } from "@/app/utils/formatDate";
import { useTranslations } from "next-intl";
import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";
import { ImageUpload } from "@/app/components/ItineraryIndividual/ImageUpload";
import { PrivateOrPublic } from "@/app/components/ItineraryIndividual/PrivateOrPublic";
import { OptionTransportation } from "@/app/components/ItineraryIndividual/OptionTransportation";
import { FlightTicket } from "@/app/components/ItineraryIndividual/TicketFlight";
import { ItineraryDetailsDays } from "@/app/components/ItineraryIndividual/ItineraryDestailsDays";

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
  const t = useTranslations("Itinerary");
  const c = useTranslations("Country.Cities");

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="align-middle w-auto md:w-96">
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
              className="h-[300px] w-full md:w-fit object-cover rounded-t-1xl opacity-90"
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
            <div className="flex mt-6 space-x-20 text-1xl text-center text-blue">
              <div className="flex flex-col">
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
            {itinerary.isOwner && <OptionTransportation />}
            {/* <FlightTicket /> */}
          </div>
        </div>
      </div>
      {/* <ItineraryDetailsDays /> */}
    </>
  );
};

export default ItineraryDetails;
