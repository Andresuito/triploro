"use client";

import React, { useState, FormEvent } from "react";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
// import Calendar from "@/app/components/Global/Calendar";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";

const NewItinerary = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [succes, setSuccess] = useState("");

  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name) {
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
      <h1 className="text-blue text-3xl font-semibold">1. Plan a new trip</h1>
      <p className="mt-8 mb-7">
        Choose the destination and dates for your itinerary.
        <br />
        Invite your companions, and decide whether to keep it private or share
        it with the world.
      </p>
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="mb-4">
          <Input
            label="Where do you want to go?"
            type="text"
            value={name}
            placeholder="Location (e.g. Madrid, Lisbon, Kilig)"
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            onChange={(value) => setName(value)}
            className="w-full"
          />
          <div className="flex">
            <Input
              label="No. of days"
              type="number"
              value={name}
              placeholder="# of days"
              highlightEmpty={highlightEmptyFields}
              hasError={!!error}
              onChange={(value) => setName(value)}
              className="w-full"
            />
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
