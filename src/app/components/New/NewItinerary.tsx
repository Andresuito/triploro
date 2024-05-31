"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import { IoClose } from "react-icons/io5";

import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import Calendar from "@/app/components/Global/Calendar";

const NewItinerary = () => {
  const t = useTranslations("New");
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [succes, setSuccess] = useState("");

  const [city, setCity] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [destinations, setDestinations] = useState<
    {
      name: string;
      lat: number;
      lng: number;
    }[]
  >([]);
  const [originalDestinations, setOriginalDestinations] = useState<
    {
      name: string;
      lat: number;
      lng: number;
    }[]
  >([]);

  const [days, setDays] = useState(0);

  const [friends, setFriends] = useState<string[]>([]);
  const [inviteMate, setInviteMate] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);
  const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  function generateRandomCode(length = 7) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get(
        `/friendship/friends/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (Array.isArray(response.data.friends)) {
        const friendNames = response.data.friends.map(
          (friend: any) => friend.username
        );
        setFriends(friendNames);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axiosInstance.get("/destination/all", {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if (Array.isArray(response.data)) {
        const destinationData = response.data.map((destination: any) => ({
          name:
            destination.name.charAt(0).toUpperCase() +
            destination.name.slice(1).toLowerCase(),
          lat: destination.latitude,
          lng: destination.longitude,
        }));

        setDestinations(destinationData);
        setOriginalDestinations(destinationData);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchFriends();
      fetchDestinations();
    }
  }, [session]);

  const handleCityChange = (value: string) => {
    setCity(value);
    const selectedCity = originalDestinations.find(
      (destination) => destination.name.toLowerCase() === value.toLowerCase()
    );
    if (selectedCity) {
      setLocation({ lat: selectedCity.lat, lng: selectedCity.lng });
    } else {
      setLocation(null);
    }
  };

  const handleUserSelect = (username: string) => {
    if (!invitedUsers.includes(username)) {
      setInvitedUsers((prevUsers) => [...prevUsers, username]);
    }
    setInviteMate("");
  };

  const handleDateSelect = (date: Date, isStartDate: boolean) => {
    if (date < new Date()) {
      setError(t("Form.Errors.InvalidDate"));
      return;
    }

    if (isStartDate) {
      if (selectedDate[1] && date >= selectedDate[1]) {
        setError(t("Form.Errors.StartDateBeforeEndDate"));
        return;
      }
      setSelectedDate([date, null]);
    } else {
      if (selectedDate[0] && date <= selectedDate[0]) {
        setError(t("Form.Errors.EndDateAfterStartDate"));
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

    if (!city || !location) {
      setHighlightEmptyFields(true);
      setError(t("Form.Errors.MissingFields"));
      return;
    }

    if (!days) {
      setHighlightEmptyFields(true);
      setError(t("Form.Errors.MissingFields"));
      return;
    }

    const originalCity = originalDestinations.find(
      (destination) => destination.name === city
    );

    const itineraryCode = generateRandomCode();

    try {
      const response = await axiosInstance.post(
        "/itinerary/create",
        {
          code: itineraryCode,
          city: originalCity?.name,
          days,
          startDate: selectedDate[0]?.toISOString(),
          endDate: selectedDate[1]?.toISOString(),
          latitude: location.lat,
          longitude: location.lng,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        setError("");
        setSuccess(t("Form.Success"));
        router.push(`/itinerary/${itineraryCode}`);
      }
    } catch (error: any) {
      console.error("Error al crear el itinerario:", error);
      setSuccess("");
      setError(t("Form.Errors." + error.response.data.error));
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-blue text-2xl md:text-3xl font-semibold">
        {t("Form.Title")}
      </h1>
      <p className="mt-8 mb-7">
        {t("Form.Info")} <br />
        {t("Form.Info2")}
      </p>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12"
      >
        <div>
          <Input
            label={t("Form.Fields.Destination")}
            type="text"
            value={city}
            placeholder={t("Form.Placeholder.Destination")}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            onChange={(value) => handleCityChange(value)}
            className="w-full"
            autocomplete="on"
            options={destinations.map((destination) => destination.name)}
          />
          <div className="grid grid-cols-2 gap-3 relative">
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
            value={inviteMate}
            placeholder={t("Form.Placeholder.InviteMates")}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            onChange={(value) => setInviteMate(value)}
            onSelect={handleUserSelect}
            className="w-full"
            autocomplete="on"
            options={friends}
          />
          <div className="my-2 flex space-x-1">
            {invitedUsers.map((user, index) => (
              <div
                key={index}
                className="bg-blue w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white relative"
              >
                {user.charAt(0).toUpperCase()}
                <IoClose
                  className="absolute top-0 right-0 cursor-pointer bg-red-600 text-white w-3 h-3 rounded-full"
                  onClick={() => {
                    setInvitedUsers(invitedUsers.filter((_, i) => i !== index));
                  }}
                />
              </div>
            ))}
          </div>
          <Button label={t("Form.Buttons.Create")} className="w-full" />
        </div>
      </form>
      {succes && (
        <p className="bg-sky-700 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
          {succes}
        </p>
      )}
      {error && (
        <p className="bg-red-500 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default NewItinerary;
