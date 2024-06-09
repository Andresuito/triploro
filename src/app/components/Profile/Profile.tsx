"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Skeleton from "@/app/components/Profile/Skeleton";
import TripsUser from "@/app/components/Profile/TripsUser";
import TripUserFavorites from "@/app/components/Profile/TripUserFavorites";
import InviteItineraries from "@/app/components/Profile/InviteItineraries";

export default function Profile() {
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
                <span className="bg-blue text-white px-2 py-1 rounded-lg">
                  {session?.user.username}
                </span>
              </h2>
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("YourTrips")}
              </h2>
              {loading ? <Skeleton /> : <TripsUser />}
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("FavoriteItineraries")}
              </h2>
              {loading ? <Skeleton /> : <TripUserFavorites />}
            </div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {t("Invitations")}
              </h2>
              {loading ? <Skeleton /> : <InviteItineraries />}
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
