import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import RegisterAuth from "@/app/components/Auth/RegisterAuth";
import { notFound } from "next/navigation";

async function fetchUser() {
  const user = await getServerSession();
  return user;
}

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Register.Title"),
    description: t("Register.Description"),
  };
}

export default async function Register() {
  const user = await fetchUser();
  if (user) {
    notFound();
  }
  return <RegisterAuth />;
}
