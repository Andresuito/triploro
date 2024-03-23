"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Input from "../../components/Global/Input";
import Button from "../../components/Global/Button";
import axiosInstance from "../../utils/axiosInstance";

const Register = () => {
  const t = useTranslations("Auth.Register");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);
  // const [accountCreated, setAccountCreated] = useState(false);

  const sendVerificationEmail = async (email: any, verificationToken: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verificationToken }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al enviar el correo de verificación");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setHighlightEmptyFields(true);
      setError(t("missing_fields"));
      return;
    }

    if (password.length < 8) {
      setError(t("password_length"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("invalid_email_format"));
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        username: email.split("@")[0],
        email,
        password,
      });

      if (response.status === 201) {
        await sendVerificationEmail(email, response.data.verificationToken);
      } else {
        setError(t(response.data.error));
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error, try later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-6">{t("Title")}</h2>
      <div className="space-y-4">
        <Input
          label={t("Email")}
          type="email"
          value={email}
          onChange={setEmail}
          highlightEmpty={highlightEmptyFields}
          placeholder={t("EmailPlaceholder")}
        />
        <Input
          label={t("Password")}
          type="password"
          value={password}
          onChange={setPassword}
          highlightEmpty={highlightEmptyFields}
          placeholder={t("PasswordPlaceholder")}
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <Button label={t("Button")} onClick={handleRegister} />
      <p className="mt-4 text-sm text-center">
        {t("Link")}{" "}
        <a href="#" className="text-blue-500">
          {t("Login_Link")}
        </a>
      </p>
    </div>
  );
};

export default Register;
