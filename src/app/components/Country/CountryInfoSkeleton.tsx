import React from "react";

const CountryInfoSkeleton = () => {
  return (
    <>
      <div className="flex justify-between items-center mt-8 md:mt-16">
        <div className="w-32 h-8 bg-gray-300 animate-pulse rounded-md"></div>
        <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-300 animate-pulse rounded-lg"></div>
        </div>
        <div>
          <div className="w-full h-8 bg-gray-300 animate-pulse rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 animate-pulse rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>
    </>
  );
};

export default CountryInfoSkeleton;
