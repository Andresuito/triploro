import React from "react";

export const FlightTicket = () => {
  return (
    <div className="flex w-full max-w-3xl text-zinc-50 h-64">
      <div className="h-full py-8 px-10 bg-zinc-900 flex-grow rounded-3xl flex flex-col">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold">BNE</span>
            <span className="text-zinc-500 text-sm">Brisbane</span>
          </div>
          <div className="flex flex-col flex-grow items-center px-10">
            <span className="font-bold text-xs">RS 11</span>
            <div className="w-full flex items-center mt-2">
              <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
              <div className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mx-2"
              >
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
              <div className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
              <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
            </div>
            <div className="flex items-center px-3 rounded-full bg-lime-400 h-8 mt-2">
              <span className="text-sm text-zinc-900">18h 35m</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold">ATH</span>
            <span className="text-zinc-500 text-sm">Athens</span>
          </div>
        </div>
        <div className="flex w-full mt-auto justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Date</span>
            <span className="font-mono">09/06/2023</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Departure</span>
            <span className="font-mono">17:45</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Passenger</span>
            <span className="font-mono">Rob Stinson</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Gate/Seat</span>
            <span className="font-mono">A11/21C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
