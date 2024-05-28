"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useTranslations } from "next-intl";
import Link from "next/link";

const VerifyEmail = () => {
  const t = useTranslations("VerifyEmail");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setStatus(t("Errors.Error"));
        setMessage(t("Errors.AlreadyVerifed"));
      } else if (token) {
        sendVerificationEmail(token);
      } else {
        setStatus(t("Error"));
        setMessage(t("Errors.NoToken"));
      }
    };

    checkSession();

    const sendVerificationEmail = async (token: string) => {
      try {
        const response = await axiosInstance.post(
          "/auth/verify-email",
          {
            token: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setStatus(t("Success.Welcome"));
          setMessage(t("Success.Message"));
        }
      } catch (error: any) {
        if (error.response.data.error === "token_expired") {
          setStatus(error.response.status);
          setError(t("Errors.TokenExpired"));
        } else if (
          error.response.data.error === "invalid_token" ||
          error.response.status === 400
        ) {
          setStatus(error.response.status);
          setError(t("Errors.InvalidToken"));
        }
        setStatus(error.response.status);
      }
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-sky-900">
      <h1 className="text-6xl font-bold mb-4 bg-blue p-5 text-white rounded">
        {status}
      </h1>
      <p className="text-2xl mb-4 text-center">{error || message}</p>
      <Link href="/" legacyBehavior>
        <a className="text-sky-800 text-lg hover:text-sky-950">{t("Back")}</a>
      </Link>
    </div>
  );
};

export default VerifyEmail;
