import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";

export const PrivateOrPublic = ({
  info,
  itineraryCode,
  onStatusChange,
}: {
  info: {
    isPublic: boolean;
  };
  itineraryCode: string;
  onStatusChange: (newStatus: boolean) => void;
}) => {
  const t = useTranslations("Itinerary");
  const { data: session } = useSession();
  const [isPublic, setIsPublic] = useState(info.isPublic);

  const handleOptionChange = async () => {
    const newPublicStatus = !isPublic;
    setIsPublic(newPublicStatus);
    onStatusChange(newPublicStatus);

    try {
      const response = await axiosInstance.patch(
        `/itinerary/public/${itineraryCode}`,
        {
          public: newPublicStatus ? 1 : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update public status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="option0"
        className="flex items-center cursor-pointer mt-2 sm:mt-0 relative"
      >
        <div className="relative">
          <input
            id="option0"
            type="checkbox"
            className="sr-only"
            checked={isPublic}
            onChange={handleOptionChange}
          />
          <div
            className={`block w-10 h-6 rounded-full transition duration-150 ${
              isPublic ? "bg-blue-600" : "bg-gray-600"
            }`}
          ></div>
          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
        </div>
        <span className="group ml-3 text-sm relative">
          {isPublic ? t("isPublicInfo") : t("isPrivateInfo")}
          <div className="absolute right-0 xl:-left-20 top-full mt-2 w-60 p-2 bg-blue pointer-events-none text-white leading-6 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition ease-in-out duration-200 z-10">
            {t("ItineraryVisibility")}
          </div>
        </span>
      </label>
    </div>
  );
};
