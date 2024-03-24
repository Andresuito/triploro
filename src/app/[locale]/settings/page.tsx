"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaLock, FaUserFriends, FaUserEdit } from "react-icons/fa";
import { PiBellSimpleFill } from "react-icons/pi";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";
import {
  InfoSection,
  SeguridadSection,
  MateSection,
  NotificationsSection,
} from "../../components/Settings/ProfileSections";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const t = useTranslations("Settings");
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

  const handleOptionClick = (option: any) => {
    setActiveOption(option);
  };

  const renderInfo = (activeOption: string, info: any) => {
    switch (activeOption) {
      case "personalInfo":
        return (
          <InfoSection
            title={t("infoSection.title")}
            description={t("infoSection.subtitle")}
            info={info}
          />
        );
      case "security":
        return (
          <SeguridadSection
            title={t("securitySection.title")}
            description={t("securitySection.subtitle")}
          />
        );
      case "companions":
        return (
          <MateSection
            title={t("mateSection.title")}
            description={t("mateSection.subtitle")}
            info={info}
          />
        );
      case "notifications":
        return (
          <NotificationsSection
            title={t("notificationsSection.title")}
            description={t("notificationsSection.subtitle")}
            info={info}
          />
        );
      default:
        return null;
    }
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

const renderInfo = (activeOption: string, info: any) => {
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
