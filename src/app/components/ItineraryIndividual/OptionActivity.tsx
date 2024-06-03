import React, { useState, useMemo } from "react";
import { FaCar, FaLandmark, FaUtensils, FaQuestion } from "react-icons/fa";
import { MdHotel, MdLocalActivity } from "react-icons/md";
import { BiSolidPlaneAlt } from "react-icons/bi";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import {
  FetchActivitiesFunction,
  DeleteActivityFunction,
} from "./ItineraryDestailsDays";
import Toast from "../Global/Toast";

interface Option {
  icon: any;
  tooltip: string;
  initialActivityData: {
    time: string;
    title: string;
    location: string;
    iconName: string;
  };
}

const options: Option[] = [
  {
    icon: BiSolidPlaneAlt,
    tooltip: "Transporte Aéreo",
    initialActivityData: {
      time: "10:00 - 12:00",
      title: "Aeropuerto Madrid-Barajas",
      location: "Terminal 4",
      iconName: "BiSolidPlaneAlt",
    },
  },
  {
    icon: FaCar,
    tooltip: "Transporte Terrestre",
    initialActivityData: {
      time: "12:00 - 14:00",
      title: "Alquiler de coche",
      location: "Aeropuerto Madrid-Barajas",
      iconName: "FaCar",
    },
  },
  {
    icon: MdHotel,
    tooltip: "Alojamiento",
    initialActivityData: {
      time: "14:00 - 16:00",
      title: "Hotel Ritz",
      location: "Plaza de la Lealtad, 5",
      iconName: "MdHotel",
    },
  },
  {
    icon: FaUtensils,
    tooltip: "Restaurante",
    initialActivityData: {
      time: "16:00 - 18:00",
      title: "Restaurante Botín",
      location: "Calle de Cuchilleros, 17",
      iconName: "FaUtensils",
    },
  },
  {
    icon: FaLandmark,
    tooltip: "Museo",
    initialActivityData: {
      time: "18:00 - 20:00",
      title: "Museo del Prado",
      location: "Paseo del Prado, s/n",
      iconName: "FaLandmark",
    },
  },
  {
    icon: MdLocalActivity,
    tooltip: "Actividad",
    initialActivityData: {
      time: "20:00 - 22:00",
      title: "Teatro Real",
      location: "Plaza de Isabel II, s/n",
      iconName: "MdLocalActivity",
    },
  },
  {
    icon: FaQuestion,
    tooltip: "Otra actividad",
    initialActivityData: {
      time: "22:00 - 00:00",
      title: "Actividad sorpresa",
      location: "Ubicación sorpresa",
      iconName: "FaQuestion",
    },
  },
];

interface OptionActivityProps {
  itinerary: any;
  day: number;
  fetchActivities: FetchActivitiesFunction;
  deleteActivity: DeleteActivityFunction;
}

const OptionActivity: React.FC<OptionActivityProps> = ({
  itinerary,
  day,
  fetchActivities,
  deleteActivity,
}) => {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<
    { id: string; element: JSX.Element }[]
  >([]);

  const handleActivityAdd = async (option: Option) => {
    const newActivity = {
      day: String(day),
      time: option.initialActivityData.time,
      title: option.initialActivityData.title,
      location: option.initialActivityData.location,
      itineraryId: itinerary.id,
      icon: option.initialActivityData.iconName,
    };

    try {
      const response = await axiosInstance.post(
        "/activity/activities",
        newActivity,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        Toast({
          message: "Actividad añadida correctamente, recuerda modificarla",
          isError: false,
        });
        fetchActivities();
      }
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const memoizedOptions = useMemo(() => options, []);

  return (
    <>
      <div className="mb-4">
        {activities.map((activity) => (
          <div key={activity.id}>{activity.element}</div>
        ))}
      </div>
      {itinerary.isOwner && (
        <>
          <h1 className="mt-8 mb-3 font-semibold">
            ¿Qué actividad desea añadir?
          </h1>
          <div className="flex">
            {memoizedOptions.map((option, index) => (
              <div
                key={option.tooltip}
                className={`relative flex justify-center items-center text-white bg-blue w-10 h-10 rounded-full shadow-lg cursor-pointer group hover:bg-white hover:border-2 hover:border-blue hover:text-blue transition duration-200 option-container ${
                  index === memoizedOptions.length - 1 ? "" : "mr-2"
                }`}
                onClick={() => handleActivityAdd(option)}
              >
                <option.icon className="transition duration-200 group-hover:scale-150" />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default OptionActivity;
