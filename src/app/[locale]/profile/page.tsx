"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import Skeleton from "../../components/Profile/Skeleton";

export default function Page() {
  const { data: session, status } = useSession();
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
                Hola,{" "}
                <span className="bg-sky-800 text-white px-2 rounded-lg">
                  {session?.user.username}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                Destinos favoritos
              </h2>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
                Itinerarios favoritos
              </h2>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
