import React from "react";
import { TfiWorld } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import Dropdown from "../Dropdown";

interface DropdownMenuProps {
  session: any;
  openModal: any;
  toggleDropdown: any;
  isDropdownOpen: any;
  setIsDropdownOpen: any;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  session,
  openModal,
  toggleDropdown,
  isDropdownOpen,
  setIsDropdownOpen,
}) => (
  <div className="relative">
    <div className="flex py-2 px-3 bg-slate-50 rounded-full border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
      <TfiWorld
        className="cursor-pointer w-5 h-5 text-gray-500 hover:text-blue transition duration-300"
        onClick={openModal}
      />
      {session ? (
        <div
          className={`flex items-center justify-center w-[28px] h-[28px] cursor-pointer ml-2 transition duration-300 bg-blue rounded-full text-white`}
          onClick={toggleDropdown}
        >
          {session.user.username[0].toUpperCase()}
        </div>
      ) : (
        <FaUserCircle
          className={`cursor-pointer w-7 h-7 ml-2 text-blue transition duration-300 ${
            session ? "text-blue" : "text-dark-900"
          }`}
          onClick={toggleDropdown}
        />
      )}
    </div>
    <Dropdown isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} />
  </div>
);

export default DropdownMenu;
