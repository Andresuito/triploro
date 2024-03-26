"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { TfiWorld } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Modal from "./Modal";
import Dropdown from "./Dropdown";

function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("Navbar");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
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
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-white p-4 text-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" legacyBehavior>
                <a className=" font-bold text-3xl text-sky-900">Triploro</a>
              </Link>
            </div>
            <div className="hidden md:flex flex-grow justify-center items-center">
              <div className="flex items-baseline space-x-4">
                <Link legacyBehavior href="/destinations">
                  <a className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200">
                    {t("Option1")}
                  </a>
                </Link>
                <a
                  href="#"
                  className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200"
                >
                  {t("Option2")}
                </a>
                <Link legacyBehavior href="/itineraries">
                  <a className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200">
                    {t("Option3")}
                  </a>
                </Link>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <div className="flex py-2 px-3 bg-slate-50 rounded-full ml-4 border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
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
                    className={`cursor-pointer w-7 h-7 ml-2 hover:text-sky-900 transition duration-300 ${
                      session ? "text-sky-900" : "text-gray-500"
                    }`}
                    onClick={toggleDropdown}
                  />
                )}
              </div>
              <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>
      </nav>
      <Modal open={modalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;
