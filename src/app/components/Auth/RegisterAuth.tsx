"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import axiosInstance from "@/app/utils/axiosInstance";

const Register = () => {
  const t = useTranslations("Auth.Register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [succes, setSucces] = useState("");
  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      setHighlightEmptyFields(true);
      setError(t("error.missing_fields"));
      return;
    }

    if (password.length < 8) {
      setError(t("error.password_length"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("error.invalid_email_format"));
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        username: email.split("@")[0],
        email,
        password,
      });

      if (response.status === 201) {
        setError("");
        setSucces(t("Success"));
      }
    } catch (error) {
      if (setSucces) setSucces("");

      setError(t((error as any)?.response?.data.error));

      if ((error as any)?.response?.data.error === "email_already_exists") {
        setError(t("error.email_already_exists"));
        return;
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border-2 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">{t("Title")}</h2>
        <div className="space-y-4">
          <Input
            label={t("Fields.Email")}
            type="email"
            value={email}
            onChange={setEmail}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Email")}
          />
          <Input
            label={t("Fields.Password")}
            type="password"
            value={password}
            onChange={setPassword}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Password")}
          />
        </div>
        {error && (
          <p className="bg-red-500 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {error}
          </p>
        )}
        {succes && (
          <p className="bg-sky-700 text-center p-2 rounded-md  text-white mt-4 text-sm mb-2">
            {t("Success")}
          </p>
        )}

        <Button label={t("Button")} onClick={handleRegister} />
        <p className="mt-4 text-sm text-center">
          {t("Links.AlreadyHaveAccount")}{" "}
          <a href="#" className="text-blue-500">
            {t("Links.Login")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
