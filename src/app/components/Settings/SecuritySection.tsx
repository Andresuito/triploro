import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";

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
                  className="p-1 px-2 text-blue rounded-md hover:bg-blue hover:text-white transition duration-200"
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
              className="p-1 px-2 text-blue rounded-md hover:bg-blue hover:text-white transition duration-200"
            >
              {t("SecuritySection.Buttons.DeleteAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
