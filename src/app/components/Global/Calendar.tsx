import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useTranslations } from "next-intl";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const t = useTranslations("Components.Calendar");
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day, index) => (
      <div key={index} className="text-sm font-semibold text-gray-500">
        {t(`Days.${day}`)}{" "}
      </div>
    ));
  };

  const renderDays = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth()
    ).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-sm">
          &nbsp;
        </div>
      );
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isSelected =
        selectedDate && currentDay.getTime() === selectedDate.getTime();
      days.push(
        <div
          key={i}
          className={`text-sm cursor-pointer py-1 hover:bg-slate-100 rounded-md text-center ${
            isSelected
              ? "bg-blue text-white hover:bg-slate-100 hover:text-gray-400"
              : "text-gray-400"
          }`}
          onClick={() => onDateSelect(currentDay)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
    );
  };

  return (
    <div className="p-5 bg-white rounded shadow-md ring-1 ring-black ring-opacity-5 select-none">
      <div className="flex justify-between items-center mb-4">
        <div
          onClick={handlePreviousMonth}
          className="text-white bg-blue/30 hover:bg-blue duration-300 transition p-1 rounded-md cursor-pointer"
        >
          <MdOutlineKeyboardArrowLeft className=" text-white" />
        </div>
        <h1 className="text-sm font-semibold text-gray-700">
          {t(`Months.${months[currentDate.getMonth()]}`)}{" "}
          {currentDate.getFullYear()}
        </h1>
        <div
          onClick={handleNextMonth}
          className="bg-blue/30 hover:bg-blue duration-300 transition p-1 rounded-md cursor-pointer"
        >
          <MdOutlineKeyboardArrowRight className="text-white" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDaysOfWeek()}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
