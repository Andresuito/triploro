"use client";

import React, { useState, FormEvent } from "react";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
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
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Ponga un nombre a su itinerario
          </label>
          <Input
            label="Nombre"
            type="text"
            value={name}
            placeholder="Nombre"
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            onChange={(value) => setName(value)}
          />
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
        <div className="flex items-center justify-between">
          <Button label="Añadir Itinerario" onClick={(e) => handleSubmit(e)} />
        </div>
      </form>
    </div>
  );
};

export default NewItinerary;
