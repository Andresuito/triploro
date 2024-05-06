"use client";

import React, { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";

import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import Calendar from "@/app/components/Global/Calendar";

const NewItinerary = () => {
  const t = useTranslations("New");
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [succes, setSuccess] = useState("");

  const [days, setDays] = useState(0);

  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date, isStartDate: boolean) => {
    if (date < new Date()) {
      setError("invalid_date");
      return;
    }

    if (isStartDate) {
      if (selectedDate[1] && date >= selectedDate[1]) {
        setError("start_date_after_end_date");
        return;
      }
      setSelectedDate([date, null]);
    } else {
      if (selectedDate[0] && date <= selectedDate[0]) {
        setError("end_date_before_start_date");
        return;
      }
      setSelectedDate([selectedDate[0], date]);
      setIsCalendarOpen(false);
      setError("");

      const diffInMilliseconds =
        date.getTime() - (selectedDate[0]?.getTime() || 0);
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setDays(diffInDays);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name) {
      setHighlightEmptyFields(true);
      setError("missing_fields");
      return;
    }

    if (!days) {
      setHighlightEmptyFields(true);
      setError("missing_fields");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/itinerary/create",
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        setError("");
        setSuccess("¡Itinerario creado exitosamente!");
      }
    } catch (error: any) {
      console.error("Error al crear el itinerario:", error);
      setError(error.response.data.error);
    }
  };

  return (
    <div className="mt-8 md:ml-12">
      <h1 className="text-blue text-2xl md:text-3xl font-semibold">
        {t("Form.Title")}
      </h1>
      <p className="mt-8 mb-7">
        {t("Form.Info")} <br />
        {t("Form.Info2")}
      </p>
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12 max-w-2xl">
          <div>
            <Input
              label={t("Form.Fields.Destination")}
              type="text"
              value={name}
              placeholder={t("Form.Placeholder.Destination")}
              highlightEmpty={highlightEmptyFields}
              hasError={!!error}
              onChange={(value) => setName(value)}
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-5 relative">
              <Input
                label={t("Form.Fields.Days")}
                type="number"
                value={days.toString()}
                placeholder={t("Form.Placeholder.Days")}
                highlightEmpty={highlightEmptyFields}
                hasError={!!error}
                onChange={(value) => setDays(Number(value))}
                className="w-full sm:w-20"
              />
              <Input
                label={t("Form.Fields.TravelDates")}
                type="text"
                placeholder={t("Form.Placeholder.TravelDates")}
                readOnly
                value={
                  selectedDate[0] && selectedDate[1]
                    ? `${selectedDate[0].toLocaleDateString()} - ${selectedDate[1].toLocaleDateString()}`
                    : selectedDate[0]
                    ? `${selectedDate[0].toLocaleDateString()} - `
                    : ""
                }
                onClick={() => setIsCalendarOpen(true)}
                onChange={() => {}}
                highlightEmpty={false}
                hasError={false}
                className="w-full"
              />
              {isCalendarOpen && (
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  isCalendarOpen={isCalendarOpen}
                  isRange={true}
                />
              )}
            </div>
          </div>
          <div>
            <Input
              label={t("Form.Fields.InviteMates")}
              type="text"
              value={name}
              placeholder={t("Form.Placeholder.InviteMates")}
              highlightEmpty={highlightEmptyFields}
              hasError={!!error}
              onChange={(value) => setName(value)}
              className="w-full"
            />
            <Button label={t("Form.Buttons.Create")} className="w-full" />
          </div>
        </div>
        {succes && (
          <p className="bg-sky-700 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {succes}
          </p>
        )}
        {error && (
          <p className="bg-red-500 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {error}
          </p>
        )}{" "}
        {/* <div className="flex items-center justify-between">
          <Button label="Añadir Itinerario" onClick={(e) => handleSubmit(e)} />
        </div> */}
      </form>
    </div>
  );
};

export default NewItinerary;
