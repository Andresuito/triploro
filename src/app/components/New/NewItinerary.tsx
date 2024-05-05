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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    if (date < new Date()) {
      setError("invalid_date");
      return;
    }

    setSelectedDate(date);
    setIsCalendarOpen(false);
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
    <div className="mt-8 ml-12">
      <h1 className="text-blue text-3xl font-semibold">{t("Form.Title")}</h1>
      <p className="mt-8 mb-7">
        {t("Form.Info")} <br />
        {t("Form.Info2")}
      </p>
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="mb-4">
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
          <div className="flex space-x-5">
            <Input
              label={t("Form.Fields.Days")}
              type="number"
              value={days.toString()}
              placeholder={t("Form.Placeholder.Days")}
              highlightEmpty={highlightEmptyFields}
              hasError={!!error}
              onChange={(value) => setDays(Number(value))}
              className="w-20"
            />
            <Input
              label={t("Form.Fields.TravelDates")}
              type="text"
              placeholder={t("Form.Placeholder.TravelDates")}
              readOnly
              value={selectedDate ? selectedDate.toLocaleDateString() : ""}
              onClick={() => setIsCalendarOpen(true)}
              onChange={() => {}}
              highlightEmpty={false}
              hasError={false}
            />
            {isCalendarOpen && (
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            )}
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
