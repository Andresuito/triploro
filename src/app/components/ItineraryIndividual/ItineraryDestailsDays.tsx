/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

interface Day {
  day: string;
  date: string;
  description: string;
}

const days: Day[] = [
  { day: "Día 1", date: "Enero 1, 2024", description: "Descripción del día 1" },
  { day: "Día 2", date: "Enero 2, 2024", description: "Descripción del día 2" },
  { day: "Día 3", date: "Enero 3, 2024", description: "Descripción del día 3" },
];

export const ItineraryDetailsDays: React.FC = () => {
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

  return (
    <ol className="relative border-l border-gray-200 text-blue mt-10">
      {days.map((item, index) => {
        const isOpen =
          openDays[index as keyof typeof openDays] ||
          closingDays[index as keyof typeof closingDays];
        const animation = useSpring({
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateX(0)" : "translateX(-20px)",
          config: { mass: 1, tension: 280, friction: 120 },
        });

        return (
          <li key={index} className="mb-10 ml-6">
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
              <animated.div style={animation}>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                  {item.date}
                </time>
                <p className="text-base font-normal text-gray-500 border border-blue rounded p-2">
                  {item.description}
                </p>
              </animated.div>
            )}
          </li>
        );
      })}
    </ol>
  );
};
