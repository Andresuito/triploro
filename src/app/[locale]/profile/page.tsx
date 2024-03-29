"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Skeleton from "../../components/Profile/Skeleton";

export default function Page() {
  const { data: session, status } = useSession();
  const t = useTranslations("Profile");
  const loading = status === "loading";

  return (
    <Suspense fallback={<Skeleton />}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mt-8 md:mt-5">
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                {t("Hello")},{" "}
                <span className="bg-sky-800 text-white px-2 rounded-lg">
                  {session?.user.username}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                {t("YourTrips")}
              </h2>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                {t("Trips")}
              </h2>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                {t("Itinearies")}
              </h2>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
