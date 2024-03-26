import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mt-8 md:mt-5">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-3">
            Hola,{" "}
            <span className="bg-gray-600 text-white px-16 rounded-lg animate-pulse">
              &nbsp;
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
  );
}
