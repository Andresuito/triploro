import ProfilePage from "@/app/components/Profile/Profile";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("Profile.Title"),
  };
}

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
