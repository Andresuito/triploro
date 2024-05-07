import React from "react";
import { useTranslations } from "next-intl";

export default function Skeleton() {
  const t = useTranslations("Profile");

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {t("Greeting")},{" "}
            <span className="bg-gray-600 text-white px-16 py-1 rounded-lg animate-pulse">
              &nbsp;
            </span>
          </h2>
        </div>
        <div className="mb-10">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
            {t("YourTrips")}
          </h2>
          <span className="bg-gray-600 text-white px-40 py-1 rounded-lg animate-pulse">
            &nbsp;
          </span>
        </div>
        <div className="mb-10">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
            {t("FavoriteDestinations")}
          </h2>
          <span className="bg-gray-600 text-white px-40 py-1 rounded-lg animate-pulse">
            &nbsp;
          </span>
        </div>
        <div className="mb-10">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
            {t("FavoriteItineraries")}
          </h2>
          <span className="bg-gray-600 text-white px-40 py-1 rounded-lg animate-pulse">
            &nbsp;
          </span>
        </div>
      </div>
    </div>
  );
}
