"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import axiosInstance from "@/app/utils/axiosInstance";
import Error from "next/error";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      } else if (token) {
        sendVerificationEmail(token);
      } else {
        router.push("/");
      }
    };

    checkSession();
  }, [token]);

  const sendVerificationEmail = async (token: string) => {
    try {
      const response = await axiosInstance.get(
        `/auth/verify-email?token=${token}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        router.push("/");
      }
      //   console.log("Error:", errorData.error);
      //   if (errorData.error === "token_expired") {
      //     router.push("/");
      //   } else if (errorData.error === "invalid_token") {
      //     router.push("/");
      //   } else {
      //     throw new Error(errorData.message);
      //   }
      // }
    } catch (error) {
      let err = error as any;
      console.error("Error:", err?.error);
    }
  };

  if (error) {
    return <Error statusCode={400} title={error} />;
  }
};

export default VerifyEmailPage;
