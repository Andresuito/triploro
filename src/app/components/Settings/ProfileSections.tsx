import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";
import { formatDate } from "../../utils/formatDate";
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
      console.log(error);
      if ((error as any)?.response?.data?.error === "invalid_name") {
        setUsernameError(t("InfoSection.error.invalid_name"));
      }

      if ((error as any)?.response?.data?.error === "username_already_exists") {
        setUsernameError(t("InfoSection.error.usernameTaken"));
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
      setEmailError(t("InfoSection.error.email_format"));
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
        setEmailError(t("InfoSection.error.email_taken"));
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
                className="bg-sky-800 p-1 px-3 text-white rounded-md mr-2"
                onClick={handleSaveUsername}
              >
                {t("InfoSection.Buttons.Save")}
              </button>
              <button
                className="p-1 px-3 text-sky-800 rounded-md hover:bg-gray-100"
                onClick={handleCancelUsername}
              >
                {t("InfoSection.Buttons.Cancel")}
              </button>
            </div>
          ) : (
            <a
              onClick={handleEditUsername}
              className="p-1 px-2 cursor-pointer text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
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
                {t("InfoSection.Buttons.Save")}
              </button>
              <button
                onClick={handleCancelEmail}
                className="p-1 px-3 text-sky-800 rounded-md hover:bg-gray-100"
              >
                {t("InfoSection.Buttons.Cancel")}
              </button>
            </div>
          ) : (
            <a
              onClick={handleEditEmail}
              className="p-1 px-2 cursor-pointer text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
            >
              {t("InfoSection.Buttons.Edit")}
            </a>
          )}
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
          `${t("SecuritySection.Messages.PasswordResetEmailSent")} <strong>${
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
                <p>{t("SecuritySection.Messages.PasswordReset")}</p>
                <button
                  onClick={handleChangePassword}
                  className="p-1 px-2 text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
                >
                  {t("SecuritySection.Buttons.ResetPassword")}
                </button>
              </>
            )}
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <p>{t("SecuritySection.Messages.DeleteAccount")}</p>
            <button
              onClick={handleDeleteAccount}
              className="p-1 px-2 text-sky-800 rounded-md hover:bg-sky-800 hover:text-white transition duration-200"
            >
              {t("SecuritySection.Buttons.DeleteAccount")}
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
              {t("MateSection.Buttons.AddMate")}
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
  info: {
    receiveNewsletter: boolean;
    receiveNewDestination: boolean;
  };
}) => {
  const [receiveNewsletter, setReceiveNewsletter] = useState(
    info.receiveNewsletter
  );
  const [receiveNewDestination, setReceiveNewDestination] = useState(
    info.receiveNewDestination
  );

  const handleOptionChange = (
    setOption: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOption((prev) => !prev);
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">{title}</h1>
      <span className="block mb-4">{description}</span>
      <div className="space-y-2 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
          <div>
            <p className="text-gray-700 font-semibold mb-1">
              Boletin de Noticias
            </p>
            <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
              Recibiras un correo electronico con informacion sobre las mejoras
              que estamos trabajando en nuestro sitio web, itinerarios y
              destinos populares.
            </span>
          </div>
          <label
            htmlFor="option0"
            className="flex items-center cursor-pointer mt-2 sm:mt-0"
          >
            <div className="relative">
              <input
                id="option0"
                type="checkbox"
                className="sr-only"
                checked={receiveNewsletter}
                onChange={() => handleOptionChange(setReceiveNewsletter)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition duration-150 ${
                  receiveNewsletter ? "bg-blue-600" : "bg-gray-600"
                }`}
              ></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
          <div>
            <p className="text-gray-700 font-semibold mb-1">Nuevos destinos</p>
            <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
              Recibiras un correo electronico cuando agregremos nuevos destinos
              a nuestro sitio web.
            </span>
          </div>
          <label
            htmlFor="option1"
            className="flex items-center cursor-pointer mt-2 sm:mt-0"
          >
            <div className="relative">
              <input
                id="option1"
                type="checkbox"
                className="sr-only"
                checked={receiveNewDestination}
                onChange={() => handleOptionChange(setReceiveNewDestination)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition duration-150 ${
                  receiveNewDestination ? "bg-blue-600" : "bg-gray-600"
                }`}
              ></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
