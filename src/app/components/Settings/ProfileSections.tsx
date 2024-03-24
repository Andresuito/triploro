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
  const [error, setError] = useState("");

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setOriginalUsername(username);
  };

  const handleCancelUsername = () => {
    setIsEditingUsername(false);
    setUsername(originalUsername);
  };

  const handleSaveUsername = async () => {
    if (username === originalUsername || username.trim() === "") {
      setIsEditingUsername(false);
      return;
    }

    if (username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }

    if (username.length > 8) {
      setError("El nombre de usuario no puede tener más de 20 caracteres");
      return;
    }

    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setError(
        "El nombre de usuario solo puede contener letras, números y guiones bajos"
      );
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
            } max-w-md w-full  bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
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
      console.error("Error:", error);
    }
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setOriginalEmail(email);
  };

  const handleCancelEmail = () => {
    setIsEditingEmail(false);
    setEmail(originalEmail);
  };

  const handleSaveEmail = async () => {
    if (email === originalEmail || email.trim() === "") {
      return;
    }

    if (!email.includes("@")) {
      setError("El correo electrónico debe ser válido");
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

        update({
          ...session,
          user: {
            ...session?.user,
            email: email,
          },
        });
      }
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
              <p className="text-gray-700 font-semibold mr-2 p-2">
                {t("infoSection.usuario")}
              </p>
              {isEditingUsername ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`border border-gray-200 p-2 rounded-lg ${
                    error ? "border-red-500" : ""
                  }`}
                />
              ) : (
                <p className="text-gray-700 text-base">{username}</p>
              )}
            </div>
            {isEditingUsername ? (
              <div>
                <button
                  className="bg-green-600 p-1 px-3 text-white rounded-lg mr-2"
                  onClick={handleSaveUsername}
                >
                  Guardar
                </button>
                <button
                  className="bg-red-600 p-1 px-3 text-white rounded-lg"
                  onClick={handleCancelUsername}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <a
                onClick={handleEditUsername}
                className="cursor-pointer text-sky-900 border-sky-900 border p-1 px-3 rounded-lg hover:bg-sky-900 hover:text-white transition duration-200"
              >
                {t("infoSection.buttonEdit")}
              </a>
            )}
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 p-2">
            <div className="flex items-center">
              <p className="text-gray-700 font-semibold mr-2 p-2">
                {t("infoSection.email")}
              </p>
              {isEditingEmail ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border border-gray-200 p-2 rounded-lg ${
                    error ? "border-red-500" : ""
                  }`}
                />
              ) : (
                <p className="text-gray-700 text-base">{email}</p>
              )}
            </div>
            {isEditingEmail ? (
              <div>
                <button
                  onClick={handleSaveEmail}
                  className="bg-green-600 p-1 px-3 text-white rounded-lg mr-2"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelEmail}
                  className="bg-red-600 p-1 px-3 text-white rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <a
                onClick={handleEditEmail}
                className="cursor-pointer text-sky-900 border-sky-900 border p-1 px-3 rounded-lg hover:bg-sky-900 hover:text-white transition duration-200"
              >
                {t("infoSection.buttonEdit")}
              </a>
            )}
          </div>
          <div className="flex items-center p-2">
            <p className="text-gray-700 font-semibold mr-2 p-2">
              {t("infoSection.accountCreated")}
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

export const SeguridadSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { data: session } = useSession();
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string>("");

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
          `Se le ha enviado un correo electrónico para restablecer la contraseña a <strong>${session?.user?.email}</strong>`
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
                <p>¿Desea restablecer su contraseña?</p>
                <button
                  onClick={handleChangePassword}
                  className="p-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg"
                >
                  Restablecer
                </button>
              </>
            )}
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 p-2">
            <p>¿Desea borrar su cuenta?</p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            >
              Borrar cuenta
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
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex items-center">
            <button className="p-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg">
              Añadir acompañante
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
