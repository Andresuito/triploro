import React, { useState, useMemo } from "react";
import { FaCar, FaTrash } from "react-icons/fa";
import { BiSolidPlaneAlt } from "react-icons/bi";

interface Option {
  icon: any;
  tooltip: string;
  getActivityInfo: (onDelete: () => void) => JSX.Element;
}

interface ActivityInfoProps {
  time: string;
  title: string;
  location: string;
  selectedIcon: JSX.Element;
  onDelete: () => void;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({
  time,
  title,
  location,
  selectedIcon,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTime, setEditedTime] = useState(time);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedLocation, setEditedLocation] = useState(location);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTime(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLocation(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 bg-blue rounded-full flex justify-center items-center mr-2">
        {selectedIcon}
      </div>
      <div className="relative w-full bg-white font-semibold text-blue p-4 rounded-lg border-2 border-blue/40 mb-2">
        {onDelete && ( // Mostrar botón de eliminar solo si onDelete está definido
          <FaTrash
            className="absolute top-2 right-2 text-red-400 hover:text-red-600 cursor-pointer"
            onClick={onDelete}
          />
        )}
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTime}
              onChange={handleTimeChange}
              className="w-fit px-2 rounded border-2 border-blue text-sm focus:outline-none focus:ring focus:border-blue-300 "
            />
            <h1 className="font-bold text-2xl my-2">
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                className="w-fit px-2 rounded border-2 border-blue font-bold text-2xl focus:outline-none focus:ring focus:border-blue-300"
              />
            </h1>
            <p className="underline underline-offset-2">
              <input
                type="text"
                value={editedLocation}
                onChange={handleLocationChange}
                className="w-fit px-2 rounded border-2 border-blue underline underline-offset-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </p>
          </>
        ) : (
          <>
            <span className="text-sm text-[#333333]" onClick={handleEditClick}>
              {time}
            </span>
            <h1 className="font-bold text-2xl" onClick={handleEditClick}>
              {editedTitle}
            </h1>
            <p
              className="underline underline-offset-2"
              onClick={handleEditClick}
            >
              {editedLocation}
            </p>
          </>
        )}
        {isEditing && (
          <button
            onClick={handleSaveClick}
            className="text-blue-500 bg-blue text-white hover:text-blue-700 mt-2 px-4 rounded"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
};

const options: Option[] = [
  {
    icon: BiSolidPlaneAlt,
    tooltip: "Transporte Aéreo",
    getActivityInfo: (onDelete) => (
      <ActivityInfo
        time="10:00 - 12:00"
        title="Aeropuerto Madrid-Barajas"
        location="Terminal 4"
        selectedIcon={<BiSolidPlaneAlt className="text-white" />}
        onDelete={onDelete}
      />
    ),
  },
  {
    icon: FaCar,
    tooltip: "Transporte Terrestre",
    getActivityInfo: (onDelete) => (
      <ActivityInfo
        time="12:00 - 14:00"
        title="Alquiler de coche"
        location="Aeropuerto Madrid-Barajas"
        selectedIcon={<FaCar className="text-white" />}
        onDelete={onDelete}
      />
    ),
  },
];

interface OptionActivityProps {
  onActivityAdd: (activityInfo: JSX.Element) => void;
  isOwner: string;
}

export const OptionActivity: React.FC<OptionActivityProps> = ({
  onActivityAdd,
  isOwner,
}) => {
  const [activities, setActivities] = useState<
    { id: string; element: JSX.Element }[]
  >([]);

  const handleActivityAdd = (option: Option) => {
    const id = `${activities.length}-${Date.now()}`;
    const activityElement = option.getActivityInfo(() =>
      handleActivityRemove(id)
    );
    setActivities((prevActivities) => [
      ...prevActivities,
      { id, element: activityElement },
    ]);
  };

  const handleActivityRemove = (id: string) => {
    setActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.id !== id)
    );
  };

  const memoizedOptions = useMemo(() => options, []);

  return (
    <>
      <div className="mb-4">
        {activities.map((activity) => (
          <div key={activity.id}>{activity.element}</div>
        ))}
      </div>
      {isOwner && (
        <>
          <h1 className="mt-8 mb-3 font-semibold">
            ¿Qué actividad desea añadir?
          </h1>
          <>
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
        </>
      )}
    </>
  );
};
