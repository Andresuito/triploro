import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import VerifyEmail from "@/app/components/Auth/VerifyEmail";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");
  return {
    title: t("VerifyEmail.Title"),
  };
}

async function fetchUser() {
  const user = await getServerSession();
  return user;
}

export default async function Register() {
  const user = await fetchUser();
  if (user) {
    notFound();
  }
  return <VerifyEmail />;
}
