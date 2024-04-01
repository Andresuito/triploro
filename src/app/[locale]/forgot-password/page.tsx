import { Metadata } from "next";
import ForgotPasswordUse from "../../components/Forgot-password/ForgotPasswordUse";

export const metadata: Metadata = {
  title: "Recovery password",
  description: "Forgot password page",
};

const Profile = () => {
  return <ForgotPasswordUse />;
};

export default Profile;
