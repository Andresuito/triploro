import React from "react";
import Map from "../../components/Map";

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mt-8 md:mt-16">
          <div>
            <h2 className="text-lg lg:text-2xl font-semibold text-gray-900">
              Destinos ofrecidos en{" "}
              <span className="bg-sky-900 px-1 text-white rounded-md">
                Triploro
              </span>
            </h2>
          </div>
        </div>
        <div className="relative">
          <Map />
        </div>
      </div>
    </div>
  );
}
