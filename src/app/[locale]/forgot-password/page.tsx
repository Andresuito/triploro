import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ForgotPasswordUse from "@/app/components/Forgot-password/ForgotPasswordUse";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("ResetPassword.Title"),
    description: t("ResetPassword.Description"),
  };
}

const Profile = () => {
  return <ForgotPasswordUse />;
};

export default Profile;
