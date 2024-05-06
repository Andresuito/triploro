import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useTranslations } from "next-intl";

interface CalendarProps {
  selectedDate: [Date | null, Date | null];
  onDateSelect: (date: Date, isStartDate: boolean) => void;
  isCalendarOpen: boolean;
  isRange: boolean;
}

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

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  isCalendarOpen,
  isRange,
}) => {
  const t = useTranslations("Components.Calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState("bottom");
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const calendarRef = useRef(null);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1)
    );
  }, []);

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
    );
  }, []);

  const generateDays = () => {
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
      days.push(generateDayElement(currentDay, i));
    }
    return { daysInMonth, firstDayOfMonth, days };
  };

  const generateDayElement = (currentDay: Date, i: number) => {
    const isSelected = isDateSelected(currentDay);
    const isInRange = isDateInRange(currentDay);
    const isHovered = isDateHovered(currentDay);
    return (
      <div
        key={i}
        className={`text-sm cursor-pointer py-1 hover:bg-slate-100 rounded-md text-center ${
          isSelected || isInRange || isHovered
            ? "bg-blue text-white hover:bg-slate-100 hover:text-gray-400"
            : "text-gray"
        }`}
        onClick={() => handleDateClick(currentDay)}
        onMouseEnter={() => setHoveredDate(currentDay)}
      >
        {i}
      </div>
    );
  };

  const isDateSelected = (date: Date) => {
    return (
      (selectedDate[0] && date.getTime() === selectedDate[0].getTime()) ||
      (selectedDate[1] && date.getTime() === selectedDate[1].getTime())
    );
  };

  const isDateInRange = (date: Date) => {
    return (
      selectedDate[0] &&
      selectedDate[1] &&
      date.getTime() > selectedDate[0].getTime() &&
      date.getTime() < selectedDate[1].getTime()
    );
  };

  const isDateHovered = (date: Date) => {
    return (
      hoveredDate &&
      selectedDate[0] &&
      date.getTime() > selectedDate[0].getTime() &&
      date.getTime() <= hoveredDate.getTime()
    );
  };

  const handleDateClick = (date: Date) => {
    const isStartDate = !selectedDate[0] || !!selectedDate[1];
    onDateSelect(date, isStartDate);
  };

  const adjustCalendarPosition = () => {
    if (isCalendarOpen) {
      const timer = setTimeout(() => {
        if (calendarRef.current) {
          const rect = (
            calendarRef.current as HTMLElement
          ).getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const enoughSpaceAbove = spaceAbove > rect.height;
          const enoughSpaceBelow = spaceBelow > rect.height;
          const nearTopEdge = rect.top < 20;

          if (enoughSpaceBelow || (nearTopEdge && !enoughSpaceAbove)) {
            setCalendarPosition("top-20");
          } else {
            setCalendarPosition("bottom-16");
          }
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  };

  const { days } = useMemo(
    () => generateDays(),
    [currentDate, selectedDate, onDateSelect, hoveredDate]
  );

  useEffect(() => {
    adjustCalendarPosition();
  }, [isCalendarOpen]);

  return (
    <div
      ref={calendarRef}
      className={`absolute ${calendarPosition}  p-5 bg-white rounded shadow-md ring-1 ring-black ring-opacity-5 select-none`}
    >
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
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-sm font-semibold text-gray-500">
            {t(`Days.${day}`)}{" "}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;
