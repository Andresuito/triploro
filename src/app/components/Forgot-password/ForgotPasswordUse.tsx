"use client";

import React, { useState, FormEvent } from "react";
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
  const [showSendButton, setShowSendBotton] = useState(true);

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();

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
        setSuccess(t("success.recovery_email_sent"));
        setShowSendBotton(false);
      }
    } catch (error) {
      if ((error as any)?.response?.data.error === "user_not_found") {
        setError(t("error.user_not_found"));
        return;
      }
    }
  };

  return (
    <div className="h-[100vh] flex justify-center">
      <div className="max-w-md mt-10 p-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-blue text-center">
          {t("Title")}
        </h1>
        <form className="flex flex-col">
          <div className="flex justify-center">
            <Input
              label={t("Fields.Email")}
              type="email"
              value={email}
              onChange={setEmail}
              highlightEmpty={highlightEmptyField}
              hasError={!!error}
              placeholder={t("Placeholders.Email")}
              className="w-[300px]"
            />
          </div>
          {error && (
            <p className="text-red-500 pb-4 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-blue pb-4 text-sm text-center">{success}</p>
          )}
          {showSendButton && (
            <div className="flex justify-center">
              <Button
                label={t("Button")}
                onClick={(e) => handleResetPassword(e)}
                className="w-[231px]"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
