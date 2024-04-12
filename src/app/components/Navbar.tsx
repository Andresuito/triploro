"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiAlignJustify } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useSpring, animated } from "react-spring";

import Link from "next/link";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import Logo from "../assets/Logo.svg";

function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("Navbar");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openModal = () => {
    setModalOpen(true);
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    if (modalOpen) {
      setModalOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    if (modalOpen) {
      setModalOpen(false);
    }
  };

  const slideIn = useSpring({
    transform: isSidebarOpen ? "translateX(0%)" : "translateX(-100%)",
    config: { tension: 500, friction: 50 },
  });

  return (
    <>
      <nav className="bg-white p-4 text-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="md:hidden flex py-2 px-3 bg-slate-50 rounded-full  border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
              <FiAlignJustify
                className="md:hidden cursor-pointer w-5 h-5 text-gray-500 hover:text-sky-900 transition duration-300"
                onClick={toggleSidebar}
              />
            </div>
            <div className="flex-shrink-0">
              <Link href="/" legacyBehavior>
                <Image
                  className="cursor-pointer"
                  src={Logo}
                  alt="Logo"
                  width={120}
                />
              </Link>
            </div>
            <div className="hidden md:flex flex-grow justify-center items-center">
              <div className="flex items-baseline space-x-4">
                <Link legacyBehavior href="/itineraries">
                  <a className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200">
                    {t("Options.Option3")}
                  </a>
                </Link>
                <a
                  href="#"
                  className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200"
                >
                  {t("Options.Option2")}
                </a>
                <Link legacyBehavior href="/destinations">
                  <a className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200">
                    {t("Options.Option1")}
                  </a>
                </Link>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <div className="flex py-2 px-3 bg-slate-50 rounded-full border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
                <TfiWorld
                  className="cursor-pointer w-5 h-5 text-gray-500 hover:text-sky-900 transition duration-300"
                  onClick={openModal}
                />
                {session ? (
                  <div
                    className={`flex items-center justify-center w-[28px] h-[28px] cursor-pointer ml-2 transition duration-300 bg-sky-900 rounded-full text-white`}
                    onClick={toggleDropdown}
                  >
                    {session.user.username[0].toUpperCase()}
                  </div>
                ) : (
                  <FaUserCircle
                    className={`cursor-pointer w-7 h-7 ml-2 text-sky-900 transition duration-300 ${
                      session ? "text-sky-900" : "text-dark-900"
                    }`}
                    onClick={toggleDropdown}
                  />
                )}
              </div>
              <Dropdown isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} />
            </div>
          </div>
        </div>
      </nav>
      {isSidebarOpen && (
        <animated.div
          style={slideIn}
          className="md:hidden bg-slate-50 h-fit w-full absolute top-20 left-0 z-50"
        >
          <div className="flex flex-col divide-y divide-slate-150">
            <Link
              legacyBehavior
              href="/itineraries"
              onClick={() => setIsSidebarOpen(false)}
            >
              <a className="px-3 py-2 font-medium">{t("Options.Option3")}</a>
            </Link>{" "}
            <hr />
            <Link
              legacyBehavior
              href="#"
              onClick={() => setIsSidebarOpen(false)}
            >
              <a className="px-3 py-2 font-medium">{t("Options.Option2")}</a>
            </Link>
            <hr />
            <Link
              legacyBehavior
              href="/destinations"
              onClick={() => setIsSidebarOpen(false)}
            >
              <a className="px-3 py-2 font-medium">{t("Options.Option1")}</a>
            </Link>
            <hr />
          </div>
        </animated.div>
      )}
      <Modal open={modalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;
