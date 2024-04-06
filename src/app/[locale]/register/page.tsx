import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegisterAuth from "@/app/components/Auth/RegisterAuth";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Register.Title"),
    description: t("Register.Description"),
  };
}

const Register = () => {
  return <RegisterAuth />;
};

export default Register;
