import React, { useState, useEffect } from "react";
import { OptionActivity } from "./OptionActivity";

interface Day {
  day: string;
  date: string;
  description: string;
  activityInfo: JSX.Element[];
}

interface ItineraryDetailsDaysProps {
  itinerary: any;
}

export const ItineraryDetailsDays: React.FC<ItineraryDetailsDaysProps> = ({
  itinerary,
}) => {
  const generateInitialDays = (num: number): Day[] => {
    return Array.from({ length: num }, (_, i) => ({
      day: `Día ${i + 1}`,
      date: "",
      description: "",
      activityInfo: [],
    }));
  };

  const [days, setDays] = useState<Day[]>(generateInitialDays(itinerary.days));
  const [openDays, setOpenDays] = useState<{ [key: number]: boolean }>({});
  const [closingDays, setClosingDays] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleDay = (index: number) => {
    setClosingDays((prev) => ({ ...prev, [index]: openDays[index] }));
    setOpenDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosingDays({});
    }, 200);
    return () => clearTimeout(timer);
  }, [openDays]);

  const addActivityToDay = (activityInfo: JSX.Element, dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activityInfo.push(
      React.cloneElement(activityInfo, {
        key: `${dayIndex}-${updatedDays[dayIndex].activityInfo.length}`,
      })
    );
    setDays(updatedDays);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-blue mb-5">
          Información del Itinerario
        </h1>
      </div>
      <ol className="relative border-l border-gray-200 text-blue">
        {days.map((item, index) => {
          const isOpen =
            openDays[index as keyof typeof openDays] ||
            closingDays[index as keyof typeof closingDays];

          return (
            <li key={index} className={`mb-10 ml-6`}>
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <span className="text-white w-10 bg-blue rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </span>
              <h3
                className="flex items-center mb-1 text-base font-semibold bg-blue w-fit text-white px-5 rounded cursor-pointer"
                onClick={() => toggleDay(index)}
              >
                {item.day}
              </h3>
              {isOpen && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <time className="block text-sm font-normal leading-none text-gray-400">
                      {item.date}
                    </time>
                  </div>
                  <OptionActivity
                    isOwner={itinerary.isOwner}
                    key={index}
                    onActivityAdd={(activityInfo) =>
                      addActivityToDay(activityInfo, index)
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
