"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import axiosInstance from "@/app/utils/axiosInstance";

const ForgotPassword = () => {
  const t = useTranslations("Auth.ForgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [highlightEmptyField, setHighlightEmptyField] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setHighlightEmptyField(true);
      setSuccess("");
      setError(t("error.missing_fields"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSuccess("");
      setError(t("error.invalid_email_format"));
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      if (response.status === 200) {
        setError("");
        setSuccess(t("recovery_email_sent"));
      }
    } catch (error) {
      if ((error as any)?.response?.data.error === "user_not_found") {
        setError(t("error.user_not_found"));
        return;
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 border-2 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">{t("Title")}</h2>
        <div className="space-y-4">
          <Input
            label={t("Fields.Email")}
            type="email"
            value={email}
            onChange={setEmail}
            highlightEmpty={highlightEmptyField}
            hasError={!!error}
            placeholder={t("Placeholders.Email")}
          />
        </div>
        {error && (
          <p className="bg-red-500 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-blue text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {success}
          </p>
        )}

        <Button label={t("Button")} onClick={handleResetPassword} />
      </div>
    </div>
  );
};

export default ForgotPassword;
