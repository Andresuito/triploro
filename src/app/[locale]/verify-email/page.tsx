import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import VerifyEmail from "@/app/components/Auth/VerifyEmail";

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
