"use client";

import { SessionProvider, signOut } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const SessionAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionAuthProvider;
