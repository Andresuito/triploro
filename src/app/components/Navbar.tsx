"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
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
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav className="bg-white p-4 shadow-md text-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Link href="/" legacyBehavior>
                <a className=" font-bold text-3xl text-sky-900">Triploro</a>
              </Link>
            </div>
            <div className="hidden md:flex flex-grow justify-center items-center">
              <div className="flex items-baseline space-x-4">
                <a
                  href="#"
                  className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200"
                >
                  {t("Option1")}
                </a>
                <a
                  href="#"
                  className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200"
                >
                  {t("Option2")}
                </a>
                <a
                  href="#"
                  className="px-3 py-2 hover:bg-slate-100 rounded-full text- font-medium transition duration-200"
                >
                  {t("Option3")}
                </a>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <div className="flex py-2 px-3 bg-slate-50 rounded-full ml-4 border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
                <TfiWorld
                  className="cursor-pointer w-5 h-5 text-gray-500 hover:text-sky-900 transition duration-300"
                  onClick={openModal}
                />
                <FaUserCircle
                  className={`cursor-pointer w-7 h-7 ml-2 hover:text-sky-900 transition duration-300 ${
                    session ? "text-sky-900" : "text-gray-500"
                  }`}
                  onClick={toggleDropdown}
                />
              </div>
              <Dropdown isOpen={dropdownOpen} />
            </div>
          </div>
        </div>
      </nav>
      <Modal open={modalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;
