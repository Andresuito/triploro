import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";

export const InfoSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  const { data: session, update } = useSession();
  const t = useTranslations("Settings");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(info.username);
  const [originalUsername, setOriginalUsername] = useState(info.username);
  const [usernameError, setUsernameError] = useState("");

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setOriginalUsername(username);
  };

  const handleCancelUsername = () => {
    setIsEditingUsername(false);
    setUsername(originalUsername);
    setUsernameError("");
  };

  const handleSaveUsername = async () => {
    if (username === originalUsername || username.trim() === "") {
      setIsEditingUsername(false);
      return;
    }

    if (username.length < 3) {
      setUsernameError(t("InfoSection.error.username_length"));
      return;
    }

    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setUsernameError(t("InfoSection.error.username_regex"));
      return;
    }

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
        setUsernameError("");

        update({
          ...session,
          user: {
            ...session?.user,
            username: username,
          },
        });

        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full  bg-blue/80 shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    Usuario cambiado con éxito
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue"
              >
                Close
              </button>
            </div>
          </div>
        ));
      }
    } catch (error) {
      console.log(error);
      if ((error as any)?.response?.data?.error === "invalid_name") {
        setUsernameError(t("InfoSection.error.invalid_name"));
      }

      if ((error as any)?.response?.data?.error === "username_already_exists") {
        setUsernameError(t("InfoSection.error.usernameTaken"));
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="flex flex-col space-y-2 mt-4 border-t border-gray-200">
        <div className="flex justify-between items-center border-b border-gray-200 p-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2 ">
                {t("InfoSection.Fields.Username")}
              </p>
              {isEditingUsername ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`border border-gray-200 p-1 px-2 rounded-md ${
                    usernameError ? "border-red-500" : ""
                  }`}
                />
              ) : (
                <p className="text-gray-700 text-base">{username}</p>
              )}
            </div>
            {usernameError && (
              <p className="text-red-500 p-2">{usernameError}</p>
            )}
          </div>
          {isEditingUsername ? (
            <div>
              <button
                className="bg-blue p-1 px-3 text-white rounded-md mr-2"
                onClick={handleSaveUsername}
              >
                {t("InfoSection.Buttons.Save")}
              </button>
              <button
                className="p-1 px-3 text-blue rounded-md hover:bg-gray-100"
                onClick={handleCancelUsername}
              >
                {t("InfoSection.Buttons.Cancel")}
              </button>
            </div>
          ) : (
            <a
              onClick={handleEditUsername}
              className="p-1 px-2 cursor-pointer text-blue rounded-md hover:bg-blue hover:text-white transition duration-200"
            >
              {t("InfoSection.Buttons.Edit")}
            </a>
          )}
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 p-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2">
                {t("InfoSection.Fields.Email")}
              </p>
              <p className="text-gray-700 text-base">{info.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center p-2 border-b border-gray-200">
          <p className="text-gray-700 font-semibold mr-2 p-2">
            {t("InfoSection.Dates.AccountCreated")}
          </p>
          <p className="text-gray-700  text-base">
            {formatDate(info["createdAt"])}
          </p>
        </div>
      </div>
    </div>
  );
};
