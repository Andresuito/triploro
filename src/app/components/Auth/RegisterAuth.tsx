"use client";

import React, { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";
import axiosInstance from "@/app/utils/axiosInstance";
import Image from "next/image";
import img_regsiter from "@/app/assets/img_register.png";
import Link from "next/link";

const Register = () => {
  const t = useTranslations("Auth.Register");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(true);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !surname || !email || !password) {
      setSuccess("");
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
        name,
        surname,
        username: email.split("@")[0],
        email,
        password,
      });

      if (response.status === 201) {
        setError("");
        setSuccess(t("Success"));
        setName("");
        setSurname("");
        setEmail("");
        setPassword("");
        setHighlightEmptyFields(false);
        setShowRegisterButton(false);
      }
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        setError(t("error.network_error"));
        return;
      }

      if (setSuccess) {
        setSuccess("");
        setHighlightEmptyFields(false);
      }

      setError(t("error." + (error as any)?.response?.data.error));

      if (error.response.data.error === "email_already_exists") {
        setError(t("error.email_already_exists"));
        return;
      }
    }
  };

  return (
    <div className="max-w-7xl min-h-screen flex mx-auto">
      <div className="hidden lg:flex lg:pl-4 w-1/2 items-center ">
        <Image
          src={img_regsiter}
          alt="Register"
          className="mb-60 mask"
          placeholder="blur"
        />
      </div>
      <div className="w-full md:w-1/2 max-w-md mx-auto mt-8 md:mt-16">
        <h1 className="text-3xl text-blue font-semibold mb-4 text-center">
          {t("Title")}
        </h1>
        <h2 className="my-4 text-sm text-center">{t("Subtitle")}</h2>
        <form
          onSubmit={handleRegister}
          className=" mx-auto justify-center items-center flex flex-col"
        >
          <Input
            label={t("Fields.Name")}
            type="Name"
            value={name}
            onChange={setName}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Name")}
            className="w-[300px]"
          />
          <Input
            label={t("Fields.Surname")}
            type="surname"
            value={surname}
            onChange={setSurname}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Surname")}
            className="w-[300px]"
          />
          <Input
            label={t("Fields.Email")}
            type="email"
            value={email}
            onChange={setEmail}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Email")}
            className="w-[300px]"
          />
          <Input
            label={t("Fields.Password")}
            type="password"
            value={password}
            onChange={setPassword}
            highlightEmpty={highlightEmptyFields}
            hasError={!!error}
            placeholder={t("Placeholders.Password")}
            className="w-[300px]"
          />
          {error && (
            <p className="w-[300px] text-center p-2 rounded-md  text-red-500 text-sm mb-2">
              {error}
            </p>
          )}
          {success && (
            <p className="w-[300px] text-center p-2 rounded-md text-blue text-sm mb-2">
              {t("Success")}
            </p>
          )}
          {showRegisterButton && (
            <Button
              label={t("Button")}
              onClick={(e) => handleRegister(e)}
              className="max-w-[145px] rounded-1xl py-3"
            />
          )}
        </form>
        <div className="mx-auto flex flex-col justify-center items-center mt-4">
          <hr className="border-[#000000]/20 sm:w-[300px]" />
          <p className="my-4 text-sm">
            {t("Links.AlreadyHaveAccount")}{" "}
            <Link href="/?modaLogin=open" legacyBehavior>
              <span className="underline hover:text-blue text-center cursor-pointer text-[#333333]/50">
                {t("Links.Login")}
              </span>
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
