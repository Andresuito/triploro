import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import VerifyEmail from "@/app/components/Auth/VerifyEmail";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return {
    title: t("VerifyEmail.Title"),
  };
}

export default async function Register() {
  return <VerifyEmail />;
}
