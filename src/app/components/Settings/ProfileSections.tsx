import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

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
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [username, setUsername] = useState(info.username);
  const [email, setEmail] = useState(info.email);
  const [originalUsername, setOriginalUsername] = useState(info.username);
  const [originalEmail, setOriginalEmail] = useState(info.email);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

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
      setUsernameError(t("infoSection.error.usernameLength"));
      return;
    }

    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setUsernameError(t("infoSection.error.usernameRegex"));
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
            } max-w-md w-full  bg-white shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nombre cambiado con éxito
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-sky-900 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-800"
              >
                Close
              </button>
            </div>
          </div>
        ));
      }
    } catch (error) {
      if ((error as any)?.response?.status === 400) {
        setUsernameError(t("infoSection.error.usernameTaken"));
      }
    }
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setOriginalEmail(email);
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setEmail(originalEmail);
    setEmailError("");
  };

  const handleSaveEmail = async () => {
    if (email === originalEmail || email.trim() === "") {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError(t("infoSection.error.emailFormat"));
      return;
    }

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
        setEmailError("");

        update({
          ...session,
          user: {
            ...session?.user,
            email: email,
          },
        });
      }
    } catch (error) {
      if ((error as any)?.response?.status === 400) {
        setEmailError(t("infoSection.error.emailTaken"));
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
                {t("infoSection.usuario")}
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
                className="bg-sky-800 p-1 px-3 text-white rounded-md mr-2"
                onClick={handleSaveUsername}
              >
                {t("infoSection.buttonSave")}
              </button>
              <button
                className="p-1 px-3 text-sky-800 rounded-md hover:bg-gray-100"
                onClick={handleCancelUsername}
              >
                {t("infoSection.buttonCancel")}
              </button>
            </div>
          ) : (
            <a
              onClick={handleEditUsername}
              className="p-1 px-2 cursor-pointer text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
            >
              {t("infoSection.buttonEdit")}
            </a>
          )}
        </div>
        <div className="flex justify-between items-center border-b border-gray-200 p-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2">
                {t("infoSection.email")}
              </p>
              {isEditingEmail ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border border-gray-200 p-1 px-2 rounded-md ${
                    emailError ? "border-red-500" : ""
                  }`}
                />
              ) : (
                <p className="text-gray-700 text-base">{email}</p>
              )}
            </div>
            {emailError && <p className="text-red-500 p-2">{emailError}</p>}
          </div>
          {isEditingEmail ? (
            <div>
              <button
                onClick={handleSaveEmail}
                className="bg-sky-800 p-1 px-3 text-white rounded-md mr-2"
              >
                {t("infoSection.buttonSave")}
              </button>
              <button
                onClick={handleCancelEmail}
                className="p-1 px-3 text-sky-800 rounded-md hover:bg-gray-100"
              >
                {t("infoSection.buttonCancel")}
              </button>
            </div>
          ) : (
            <a
              onClick={handleEditEmail}
              className="p-1 px-2 cursor-pointer text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
            >
              {t("infoSection.buttonEdit")}
            </a>
          )}
        </div>
        <div className="flex items-center p-2 border-b border-gray-200">
          <p className="text-gray-700 font-semibold mr-2 p-2">
            {t("infoSection.accountCreated")}
          </p>
          <p className="text-gray-700  text-base">
            {new Date(info["createdAt"]).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour12: false,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export const SeguridadSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { data: session } = useSession();
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string>("");
  const t = useTranslations("Settings");

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
        signOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axiosInstance.post(
        "/profile/email-password",
        {
          email: session?.user?.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setResetPasswordMessage(
          `${t("securitySection.msgUser")} <strong>${
            session?.user?.email
          }</strong>`
        );
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
            {resetPasswordMessage ? (
              <p dangerouslySetInnerHTML={{ __html: resetPasswordMessage }}></p>
            ) : (
              <>
                <p>{t("securitySection.passwordMsg")}</p>
                <button
                  onClick={handleChangePassword}
                  className="p-1 px-2 text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
                >
                  {t("securitySection.buttonPassword")}
                </button>
              </>
            )}
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <p>{t("securitySection.deleteMsg")}</p>
            <button
              onClick={handleDeleteAccount}
              className="p-1 px-2 text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
            >
              {t("securitySection.buttonDeleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MateSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  const t = useTranslations("Settings");

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex items-center">
            <button className="p-1 px-2 cursor-pointer text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200">
              {t("mateSection.buttonAddMate")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationsSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: any;
}) => {
  const [option0, setOption0] = useState(true);
  const [option1, setOption1] = useState(true);

  const handleOptionChange = (setOption: any) => {
    setOption((prev: any) => !prev);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className=" pb-4 mb-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-2">
          <p className="text-gray-700 font-semibold mr-2 p-2">
            Nuevos destinos e itinerarios
          </p>
          <label htmlFor="option0" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="option0"
                type="checkbox"
                className="sr-only"
                checked={option0}
                onChange={() => handleOptionChange(setOption0)}
              />
              <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-between border-b border-gray-200 p-2">
          <p className="text-gray-700 font-semibold mr-2 p-2">
            Recordatorios de viajes
          </p>
          <label htmlFor="option1" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="option1"
                type="checkbox"
                className="sr-only"
                checked={option1}
                onChange={() => handleOptionChange(setOption1)}
              />
              <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
