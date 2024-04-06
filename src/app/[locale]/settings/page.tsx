"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaLock, FaUserFriends, FaUserEdit } from "react-icons/fa";
import { PiBellSimpleFill } from "react-icons/pi";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";
import {
  InfoSection,
  SeguridadSection,
  MateSection,
  NotificationsSection,
} from "@/app/components/Settings/ProfileSections";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const t = useTranslations("Settings");
  const [info, setInfo] = useState(null);
  const [activeOption, setActiveOption] = useState("personalInfo");

  useEffect(() => {
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

    if (status === "authenticated") {
      getInfo();
    }
  }, [status, session]);

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
            title={t("InfoSection.Title")}
            description={t("InfoSection.Subtitle")}
            info={info}
          />
        );
      case "notifications":
        return (
          <NotificationsSection
            title={t("NotificationsSection.Title")}
            description={t("NotificationsSection.Subtitle")}
            info={info}
          />
        );
      case "security":
        return (
          <SeguridadSection
            title={t("SecuritySection.Title")}
            description={t("SecuritySection.Subtitle")}
          />
        );
      case "companions":
        return (
          <MateSection
            title={t("MateSection.Title")}
            description={t("MateSection.Subtitle")}
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
                text={t("InfoSection.Title")}
                active={activeOption === "personalInfo"}
                onClick={() => handleOptionClick("personalInfo")}
              />
              <ProfileOptionButton
                icon={<PiBellSimpleFill className="mr-2" />}
                text={t("NotificationsSection.Title")}
                active={activeOption === "notifications"}
                onClick={() => handleOptionClick("notifications")}
              />
              <ProfileOptionButton
                icon={<FaLock className="mr-2" />}
                text={t("SecuritySection.Title")}
                active={activeOption === "security"}
                onClick={() => handleOptionClick("security")}
              />
              <ProfileOptionButton
                icon={<FaUserFriends className="mr-2" />}
                text={t("MateSection.Title")}
                active={activeOption === "companions"}
                onClick={() => handleOptionClick("companions")}
              />
            </div>
            <div className="py-4 md:p-4 ml-5 md:w-2/3">
              {renderInfo(activeOption, info)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
