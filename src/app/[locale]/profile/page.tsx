import ProfilePage from "@/app/components/Profile/Profile";
import { getServerSession } from "next-auth";

export async function generateMetadata() {
  const data = await getServerSession();
  return {
    title: `${data?.user.name}`,
  };
}

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
