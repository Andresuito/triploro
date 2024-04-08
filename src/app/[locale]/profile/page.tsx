import ProfilePage from "@/app/components/Profile/Profile";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";

export async function generateMetadata() {
  const t = await getTranslations("Metadata");

  const data = await getServerSession();
  return {
    title: `${data?.user.name}`,
    description: t("Profile.Description"),
  };
}

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
