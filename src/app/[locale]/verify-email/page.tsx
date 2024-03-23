"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData.error);
        if (errorData.error === "token_expired") {
          router.push("/");
        } else if (errorData.error === "invalid_token") {
          router.push("/");
        } else {
          throw new Error(errorData.message);
        }
      }
    } catch (error) {
      let err = error as any;
      console.error("Error:", err?.error);
    }
  };

  if (error) {
    return <Error statusCode={400} title={error} />;
  }

  return (
    <div>
      <p>Verificando el correo electrónico...</p>
    </div>
  );
};

export default VerifyEmailPage;
