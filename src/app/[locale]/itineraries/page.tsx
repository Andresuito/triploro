"use client";

import React, { useState } from "react";

export default function ItinerariesPage() {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* <div className="w-80 h-60 shadow-lg bg-white rounded-lg relative">
          <svg
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 transition-all duration-200 cursor-pointer hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={25}
            height={25}
            stroke={isFavorited ? "black" : "black"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
          >
            <path
              fill={isFavorited ? "#F87171" : "none"}
              d="M2 9.137C2 14 6.02 16.591 8.962 18.911 10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138c0-4.863-5.5-8.312-10-3.636C7.5.825 2 4.274 2 9.137Z"
            />
            <path
              fill={isFavorited ? "#F87171" : "none"}
              d="M2 9.137C2 14 6.02 16.591 8.962 18.911 10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138c0-4.863-5.5-8.312-10-3.636C7.5.825 2 4.274 2 9.137Z"
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
}
