import React, { useState, useEffect } from "react";
import OptionActivity from "./OptionActivity";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { FaCar, FaLandmark, FaUtensils, FaQuestion } from "react-icons/fa";
import { MdHotel, MdLocalActivity } from "react-icons/md";
import { BiSolidPlaneAlt } from "react-icons/bi";
import Toast from "../Global/Toast";

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
}

export interface FetchActivitiesFunction {
  (): Promise<void>;
}

export interface DeleteActivityFunction {
  (id: number): Promise<void>;
}

export const ItineraryDetailsDays: React.FC<ItineraryDetailsDaysProps> = ({
  itinerary,
}) => {
  const { data: session } = useSession();

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
      day: `Día ${i + 1}`,
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
        message: "Error fetching activities",
        isError: true,
      });
      console.error("Error fetching activities:", error);
    }
  };

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editedTime, setEditedTime] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedLocation, setEditedLocation] = useState("");

  const handleActivityEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setEditedTime(activity.time);
    setEditedTitle(activity.title);
    setEditedLocation(activity.location);
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
          message: "Actividad actualizada correctamente",
          isError: false,
        });
        fetchActivities();
        setEditingActivity(null);
      }
    } catch (error) {
      console.error("Error updating activity:", error);
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
        message: "Actividad eliminada correctamente",
        isError: false,
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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

          function addActivityToDay(
            activityInfo: JSX.Element,
            index: number
          ): void {
            throw new Error("Function not implemented.");
          }

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
                            <input
                              type="text"
                              value={editedTime}
                              onChange={(e) => setEditedTime(e.target.value)}
                              className="border-2 border-blue rounded-md"
                            />
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="ml-2 border-2 border-blue rounded-md"
                            />
                            <input
                              type="text"
                              value={editedLocation}
                              onChange={(e) =>
                                setEditedLocation(e.target.value)
                              }
                              className="mx-2 border-2 border-blue rounded-md"
                            />
                            <button
                              className="bg-blue text-white px-2 py-1 rounded-md"
                              onClick={handleActivityUpdate}
                            >
                              Guardar cambios
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-[#333333]">
                              {activity.time}
                            </span>
                            <h1 className="font-bold text-2xl">
                              {activity.title}
                            </h1>
                            <p className="underline underline-offset-2">
                              {activity.location}
                            </p>
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
