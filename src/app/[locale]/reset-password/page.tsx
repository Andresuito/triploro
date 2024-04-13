"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import axiosInstance from "@/app/utils/axiosInstance";

export default function ResetPasswordPage() {
  const t = useTranslations("Auth.ResetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);
  const [newPassword, setPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setError(t("error.missing_fields"));
      setHighlightEmptyFields(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(t("error.passwords_not_match"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("error.password_length"));
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError(t("error.password_format"));
      return;
    }

    try {
      const response = await axiosInstance.patch(
        "/auth/change-password",
        {
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        signOut();
      }
    } catch (error) {
      setError(t((error as any)?.response?.data.error));

      if ((error as any)?.response?.data.error === "missing_token") {
        setError(t("error.missing_token"));
      }
    }
  };

  return (
    <div className="h-[100vh]">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">{t("Title")}</h2>

        <div className="space-y-4">
          <Input
            label={t("Fields.NewPassword")}
            type="password"
            value={newPassword}
            onChange={setPassword}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.NewPassword")}
          />
          <Input
            label={t("Fields.ConfirmPassword")}
            type="password"
            value={confirmNewPassword}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            onChange={setConfirmPassword}
            placeholder={t("Placeholders.ConfirmPassword")}
          />
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <Button label={t("Button")} onClick={handleResetPassword} />
      </div>
    </div>
  );
}
