import { Metadata } from "next";
import RegisterAuth from "../../components/Auth/RegisterAuth";

export const metadata: Metadata = {
  title: "Register",
};

const Register = () => {
  return <RegisterAuth />;
};

export default Register;
