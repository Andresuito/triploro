"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
          router.push("/");
        }
      } catch (error: any) {
        if (error.response.data.error === "token_expired") {
          setError("Token expired");
        } else if (error.response.data.error === "invalid_token") {
          setError("Invalid token");
        }
      }
    };
  }, [token, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-sky-900">
        <h1 className="text-9xl font-bold mb-4 text-sky-900">400</h1>
        <p className="text-2xl mb-4">{error}</p>
        <Link href="/" legacyBehavior>
          <a className="text-sky-800 text-lg hover:text-sky-950"></a>
        </Link>
      </div>
    );
  }
};

export default VerifyEmail;
