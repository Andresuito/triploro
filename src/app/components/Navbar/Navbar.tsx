"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { NavbarHeader } from "./NavbarHeader";
import { NavbarLinks } from "./NavbarLinks";
import DropdownMenu from "./DropdownMenu";
import { Sidebar } from "./Sidebar";

import Modal from "../Modal";

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

  const handleNavLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-white p-4 text-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <NavbarHeader toggleSidebar={toggleSidebar} />
            <NavbarLinks t={t} handleNavLinkClick={handleNavLinkClick} />
            <DropdownMenu
              session={session}
              openModal={openModal}
              toggleDropdown={toggleDropdown}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>
        </div>
      </nav>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        handleNavLinkClick={handleNavLinkClick}
        t={t}
      />
      <Modal open={modalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;
