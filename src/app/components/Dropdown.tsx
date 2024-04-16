"use client";

import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

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
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (searchParams.get("modaLogin") === "open") {
      setLoginOpen(true);
      toast.success(
        "Tu cuenta ha sido creada exitosamente, verifica tu correo para activarla."
      );
    }
  }, [searchParams]);

  return (
    <>
      <animated.div
        className="w-fit absolute top-16 right-5 2xl:right-0 z-40 shadow-lg ring-1 ring-black ring-opacity-5 rounded-md  bg-white  "
        style={dropdownAnimation}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {isOpen && (
            <>
              {session ? (
                <>
                  <p className="block px-4 pt-2 text-sm">
                    <span className="font-semibold  text-gray-700">
                      {session.user.name}
                    </span>
                  </p>
                  <p className="block px-4 pb-2 text-sm text-gray-500">
                    {session.user.email}
                  </p>
                  <Link href={`/profile`} legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 cursor-pointer text-sm text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
                      role="menuitem"
                    >
                      {t("Profile")}
                    </a>
                  </Link>
                  <Link href={`/settings`} legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 cursor-pointer text-sm text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
                      role="menuitem"
                    >
                      {t("Configuration")}
                    </a>
                  </Link>
                  <Link href="/help" legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 text-sm text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
                      role="menuitem"
                    >
                      {t("FAQ")}
                    </a>
                  </Link>
                  <hr />
                  <div className="flex px-4 py-2 text-sm text-gray-500 hover:text-blue transition duration-100 justify-between">
                    {t("Theme")}
                    <select className="ml-2 px-1 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-md cursor-pointer outline-blue outline-opacity-50">
                      <option value="tema1">Triploro</option>
                      <option value="tema2">Summer</option>
                    </select>
                  </div>
                  <hr />
                  <a
                    onClick={() => {
                      signOut();
                      handleMenuClick();
                    }}
                    className="block px-4 py-2 text-sm cursor-pointer text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
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
                    className="block px-4 py-2 text-sm cursor-pointer text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100 text-nowrap"
                    role="menuitem"
                  >
                    {t("Login")}
                  </a>
                  <Link href="/register" legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 text-sm text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
                      role="menuitem"
                    >
                      {t("Register")}
                    </a>
                  </Link>
                  <Link href="/help" legacyBehavior>
                    <a
                      onClick={handleMenuClick}
                      className="block px-4 py-2 text-sm text-gray-500 hover:text-blue transition duration-100 hover:bg-slate-100"
                      role="menuitem"
                    >
                      {t("FAQ")}
                    </a>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </animated.div>
      <Login open={modaLogin} onClose={closeLogin} />
    </>
  );
};

export default Dropdown;
