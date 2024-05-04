import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import axiosInstance from "../../utils/axiosInstance";
import ModalWindow from "@/app/components/ModalWindow";

export const SeguridadSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { data: session } = useSession();
  const t = useTranslations("Settings");

  const [resetPasswordMessage, setResetPasswordMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4">
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
              onClick={() => setIsModalOpen(true)}
              className="p-1 px-2 text-blue rounded-md hover:bg-blue hover:text-white transition duration-200"
            >
              {t("SecuritySection.Buttons.DeleteAccount")}
            </button>
          </div>
        </div>
      </div>
      <ModalWindow
        open={isModalOpen}
        title={t("SecuritySection.Modal.TitleModal")}
        className="w-3/5"
        onClose={() => {
          setIsModalOpen(false);
        }}
        content={
          <div>
            <p>{t("SecuritySection.Modal.Subtitle")}</p>
            <ul className="list-disc list-inside mt-4">
              <li>{t("SecuritySection.Modal.List.List1")}</li>
              <li>{t("SecuritySection.Modal.List.List2")}</li>
              <li>{t("SecuritySection.Modal.List.List3")}</li>
              <li>{t("SecuritySection.Modal.List.List4")}</li>
            </ul>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="p-1 px-2 rounded-1xl bg-gray-600 opacity-70 hover:opacity-100 text-white transition duration-200"
              >
                {t("SecuritySection.Modal.Buttons.Cancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="p-1 px-2 text-red rounded-1xl text-white bg-blue opacity-70 hover:opacity-100 transition duration-200"
              >
                {t("SecuritySection.Modal.Buttons.Delete")}
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
