"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Skeleton from "@/app/components/Profile/Skeleton";

export default function Page() {
  const { data: session, status } = useSession();
  const t = useTranslations("Profile");
  const loading = status === "loading";

  return (
    <Suspense fallback={<Skeleton />}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("Greeting")},{" "}
                <span className="bg-sky-800 text-white px-2 py-1 rounded-lg">
                  {session?.user.username}
                </span>
              </h2>
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("YourTrips")}
              </h2>
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("FavoriteDestinations")}
              </h2>
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("FavoriteItineraries")}
              </h2>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
