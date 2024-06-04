import React, { useState, useEffect } from "react";
import OptionActivity from "./OptionActivity";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { FaCar, FaLandmark, FaUtensils, FaQuestion } from "react-icons/fa";
import { MdHotel, MdLocalActivity } from "react-icons/md";
import { BiSolidPlaneAlt } from "react-icons/bi";
import Toast from "../Global/Toast";
import { useTranslations } from "next-intl";

interface Activity {
  id: number;
  day: string;
  time: string;
  title: string;
  location: string;
  icon: any;
  createdAt: string;
  updatedAt: string;
  itineraryId: number;
}

interface Day {
  day: string;
  date: string;
  description: string;
  activities: Activity[];
}

interface ItineraryDetailsDaysProps {
  itinerary: any;
  titleText: string;
  addressText: string;
}

export interface FetchActivitiesFunction {
  (): Promise<void>;
}

export interface DeleteActivityFunction {
  (id: number): Promise<void>;
}

export const ItineraryDetailsDays: React.FC<ItineraryDetailsDaysProps> = ({
  itinerary,
  titleText,
  addressText,
}) => {
  const { data: session } = useSession();
  const t = useTranslations("Itinerary");

  const iconMap: { [key: string]: JSX.Element } = {
    FaCar: <FaCar />,
    BiSolidPlaneAlt: <BiSolidPlaneAlt />,
    MdHotel: <MdHotel />,
    FaUtensils: <FaUtensils />,
    FaLandmark: <FaLandmark />,
    MdLocalActivity: <MdLocalActivity />,
    FaQuestion: <FaQuestion />,
  };

  const generateInitialDays = (num: number): Day[] => {
    return Array.from({ length: num }, (_, i) => ({
      day: `${t("Day")} ${i + 1}`,
      date: "",
      description: "",
      activities: [],
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

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get(
        `/activity/activities/${itinerary.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      const activities: Activity[] = response.data.activities;

      setDays((prevDays) =>
        prevDays.map((day, index) => ({
          ...day,
          activities: activities.filter(
            (activity: Activity) => parseInt(activity.day) === index
          ),
        }))
      );
    } catch (error) {
      Toast({
        message: t("Errors.Fetching_Activities"),
        isError: true,
      });
    }
  };

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editedTime, setEditedTime] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedLocation, setEditedLocation] = useState("");

  const handleActivityEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setEditedTime(activity.time);
    setEditedTitle(titleText || activity.title);
    setEditedLocation(addressText || activity.location);
  };

  const handleActivityUpdate = async () => {
    if (!editingActivity) return;

    const updatedActivity = {
      ...editingActivity,
      time: editedTime,
      title: editedTitle,
      location: editedLocation,
    };

    try {
      const response = await axiosInstance.put(
        `/activity/activities/${updatedActivity.id}`,
        updatedActivity,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        Toast({
          message: t("Success.ActivityUpdated"),
          isError: false,
        });
        fetchActivities();
        setEditingActivity(null);
      }
    } catch (error) {
      Toast({
        message: t("Errors.Updating_Activity"),
        isError: true,
      });
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      await axiosInstance.delete(`/activity/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      fetchActivities();
      Toast({
        message: t("Success.ActivityDeleted"),
        isError: false,
      });
    } catch (error) {
      Toast({
        message: t("Errors.Deleteing_Activity"),
        isError: true,
      });
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (editingActivity) {
      setEditedTitle(titleText);
      setEditedLocation(addressText);
    }
  }, [titleText, addressText, editingActivity]);

  return (
    <div className="mt-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-blue mb-5">{t("Info")}</h1>
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
                  {item.activities.map((activity, activityIndex) => (
                    <div className="flex items-center" key={activityIndex}>
                      <div className="w-10 h-10 bg-blue rounded-full flex justify-center items-center mr-2 text-white">
                        {iconMap[activity.icon]}
                      </div>
                      <div className="relative w-full bg-white font-semibold text-blue p-4 rounded-lg border-2 border-blue/40 mb-2">
                        {itinerary.isOwner && (
                          <div className="absolute top-2 right-2 flex space-x-2 items-center justify-center">
                            <div
                              className="bg-orange-500/80 hover:bg-orange-500 cursor-pointer rounded-full w-7 h-7 flex items-center justify-center"
                              onClick={() => handleActivityEdit(activity)}
                            >
                              <FaPencilAlt className="text-white text-sm" />
                            </div>
                            <div className="bg-red-600/80 hover:bg-red-600 cursor-pointer rounded-full w-7 h-7 flex items-center justify-center">
                              <FaTrash
                                className="text-white text-sm"
                                onClick={() => deleteActivity(activity.id)}
                              />
                            </div>
                          </div>
                        )}
                        {editingActivity &&
                        editingActivity.id === activity.id ? (
                          <>
                            <div className="flex flex-col space-y-2">
                              <input
                                type="text"
                                value={editedTime}
                                onChange={(e) => setEditedTime(e.target.value)}
                                className="border-2 border-blue rounded-md w-fit"
                              />
                              <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="border-2 border-blue rounded-md w-2/3"
                              />
                              <input
                                type="text"
                                name="location"
                                className="border-2 border-blue rounded-md w-2/3"
                                value={editedLocation}
                                onChange={(e) =>
                                  setEditedLocation(e.target.value)
                                }
                              />

                              <button
                                className="bg-blue text-white px-2 py-1 rounded-md"
                                onClick={handleActivityUpdate}
                              >
                                {t("Buttons.SaveChanges")}
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-zinc-400 font-normal">
                              {activity.time}
                            </span>
                            <h1 className="font-bold text-2xl">
                              {activity.title || titleText}
                            </h1>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                activity.location || addressText
                              )}`}
                              target="_blank"
                              className="underline underline-offset-2 cursor-pointer text-sm font-normal text-zinc-400 hover:text-blue"
                            >
                              {activity.location || addressText}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <OptionActivity
                    itinerary={itinerary}
                    day={index}
                    fetchActivities={fetchActivities}
                    deleteActivity={deleteActivity}
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
