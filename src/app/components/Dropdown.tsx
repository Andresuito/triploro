"use client";

import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Login from "./Login";
import { useTranslations } from "next-intl";

const Dropdown = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const t = useTranslations("Navbar.Dropdown");
  const { data: session } = useSession();
  const dropdownAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(-100%)",
    config: {
      tension: 210,
      friction: 20,
    },
  });

  const [modaLogin, setLoginOpen] = useState(false);
  const openLogin = () => {
    setLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginOpen(false);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <animated.div
        className="w-32 absolute top-16 right-5 2xl:left-1 z-10 shadow-lg ring-1 ring-black ring-opacity-5 rounded-md  bg-white  "
        style={dropdownAnimation}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {isOpen && (
            <>
              {session ? (
                <>
                  <Link href={`/profile?id=${session.user.id}`} legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {t("Profile")}
                    </a>
                  </Link>
                  <Link href={`/settings?id=${session.user.id}`} legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {t("Configuration")}
                    </a>
                  </Link>
                  <a
                    onClick={() => {
                      signOut();
                      handleMenuClick();
                    }}
                    className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t("Logout")}
                  </a>
                </>
              ) : (
                <>
                  <a
                    onClick={() => {
                      openLogin();
                      handleMenuClick();
                    }}
                    className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t("Login")}
                  </a>
                  <Link href="/register" legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {t("Register")}
                    </a>
                  </Link>
                </>
              )}
              <hr />
              <Link href="/help" legacyBehavior>
                <a
                  onClick={handleMenuClick}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {t("FAQ")}
                </a>
              </Link>
            </>
          )}
        </div>
      </animated.div>
      <Login open={modaLogin} onClose={closeLogin} />
    </>
  );
};

export default Dropdown;
