import { Metadata } from "next";
import ProfilePage from "../../components/Profile/Profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile page",
};

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
