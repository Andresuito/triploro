import React from "react";

const SkeletonItinerary = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto mt-8 md:mt-16 animate-pulse">
      <div className="flex">
        <div className="w-96">
          <div className="flex justify-center relative">
            <div className="w-96 h-[300px] object-cover rounded-t-1xl opacity-90 bg-gray-300" />
          </div>
          <div className="p-5 rounded-b-1xl shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="bg-gray-300 w-1/2 h-6" />
              <div className="p-1 px-1 rounded-md bg-gray-300 w-16 h-4" />
            </div>
            <div className="flex mt-6 space-x-20">
              <div className="flex flex-col">
                <div className="bg-gray-300 rounded-md w-16 h-4" />
                <div className="bg-gray-300 rounded-md w-16 h-4 mt-2" />
              </div>
              <div className="flex flex-col">
                <div className="bg-gray-300 rounded-md w-16 h-4" />
                <div className="bg-gray-300 rounded-md w-16 h-4 mt-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="ml-10">
          <div className="bg-gray-300 rounded-md w-1/2 h-6" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonItinerary;
