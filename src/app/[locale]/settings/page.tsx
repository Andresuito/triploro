"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { FaLock, FaUserFriends, FaUserEdit } from "react-icons/fa";
import { PiBellSimpleFill } from "react-icons/pi";
import axiosInstance from "../../utils/axiosInstance";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [info, setInfo] = useState(null);
  const [activeOption, setActiveOption] = useState("personalInfo");

  useEffect(() => {
    if (status === "authenticated") {
      getInfo();
    }
  }, [status]);

  const getInfo = async () => {
    if (!session) {
      console.error("El usuario no está autenticado");
      return;
    }

    try {
      const response = await axiosInstance.get("/profile/profile", {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      setInfo(response.data);
    } catch (error) {
      console.error("Error al obtener la información protegida:", error);
    }
  };

  const handleOptionClick = (option: any) => {
    setActiveOption(option);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto ">
      <div className="p-8 md:flex md:justify-between">
        {info && (
          <>
            <div className="bg-white p-6 h-[290px] md:w-1/3 rounded-md border border-gray-200">
              <ProfileOptionButton
                icon={<FaUserEdit className="mr-2" />}
                text="Datos personales"
                active={activeOption === "personalInfo"}
                onClick={() => handleOptionClick("personalInfo")}
              />
              <ProfileOptionButton
                icon={<PiBellSimpleFill className="mr-2" />}
                text="Notificaciones"
                active={activeOption === "notifications"}
                onClick={() => handleOptionClick("notifications")}
              />
              <ProfileOptionButton
                icon={<FaLock className="mr-2" />}
                text="Seguridad"
                active={activeOption === "security"}
                onClick={() => handleOptionClick("security")}
              />
              <ProfileOptionButton
                icon={<FaUserFriends className="mr-2" />}
                text="Acompañantes"
                active={activeOption === "companions"}
                onClick={() => handleOptionClick("companions")}
              />
            </div>
            <div className="p-4 ml-5 md:w-2/3">
              {renderInfo(activeOption, info)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ProfileOptionButton = ({
  icon,
  text,
  active,
  onClick,
}: {
  icon: JSX.Element;
  text: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`flex items-center w-full p-4 text-left rounded-lg text-gray-800 hover:bg-gray-100 mb-2 ${
        active && "border text-sky-900 border-sky-900 hover:border-sky-900"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

const renderInfo = (activeOption: any, info: any) => {
  switch (activeOption) {
    case "personalInfo":
      return (
        <InfoSection
          title="Datos personales"
          description="Actualiza tus datos y descubre cómo se utilizan."
          info={info}
        />
      );
    case "security":
      return (
        <SeguridadSection
          title="Seguridad"
          description="Modifica los ajustes de seguridad, configura la autenticación segura o elimina tu cuenta."
          info={info}
        />
      );
    case "companions":
      return (
        <MateSection
          title="Acompañantes"
          description="Gestiona o edita los acompañantes de tus viajes."
          info={info}
        />
      );
    case "notifications":
      return (
        <NotificationsSection
          title="Notificaciones"
          description="Configura las notificaciones que deseas recibir."
          info={info}
        />
      );
    default:
      return null;
  }
};

interface Info {
  username: string;
  email: string;
  createdAt: string;
}

const InfoSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: Info;
}) => {
  const { data: session } = useSession();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [username, setUsername] = useState(info.username);
  const [email, setEmail] = useState(info.email);

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  const handleSaveUsername = async () => {
    try {
      const response = await axiosInstance.patch(
        "/profile/username",
        {
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsEditingUsername(false);
      }
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      const response = await axiosInstance.patch(
        "/profile/email",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsEditingEmail(false);
      }
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200">
          <div className="flex justify-between items-center border-b border-gray-200 p-2">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2">Usuario:</p>
              {isEditingUsername ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-200 p-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-700 text-base">{username}</p>
              )}
            </div>
            {isEditingUsername ? (
              <button
                className="bg-green-600 p-2 text-white rounded-xl"
                onClick={handleSaveUsername}
              >
                Guardar
              </button>
            ) : (
              <a
                onClick={handleEditUsername}
                className="cursor-pointer hover:text-sky-900"
              >
                Editar
              </a>
            )}
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 p-2">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2">
                Correo electrónico:
              </p>
              {isEditingEmail ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-200 p-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-700 text-base">{email}</p>
              )}
            </div>
            {isEditingEmail ? (
              <button
                onClick={handleSaveEmail}
                className="bg-green-600 p-2 text-white rounded-xl"
              >
                Guardar
              </button>
            ) : (
              <a
                onClick={handleEditEmail}
                className="cursor-pointer hover:text-sky-900"
              >
                Editar
              </a>
            )}
          </div>
          <div className="flex items-center p-2">
            <p className="text-gray-700 font-semibold mr-2 p-2">
              Fecha de creación:
            </p>
            <p className="text-gray-700  text-base">
              {new Date(info["createdAt"]).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeguridadSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  const { data: session } = useSession();

  const handleDeleteAccount = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete("/profile/delete-account", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (response.status === 200) {
        await signOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <p>¿Desea borrar su cuenta?</p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Borrar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MateSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex items-center p-2">
            <button className="p-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg">
              Añadir acompañante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className=" pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200">
          <div className="flex items-center border-b border-gray-200 p-2">
            <p className="text-gray-700 font-semibold mr-2 p-2">
              Notificaciones activas:
            </p>
            <p className="text-gray-700 text-base">{info["notifications"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
