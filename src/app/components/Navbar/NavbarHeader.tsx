import React from "react";
import Image from "next/image";
import { FiAlignJustify } from "react-icons/fi";
import Link from "next/link";
import Logo from "../../assets/Logo.svg";

export const NavbarHeader = ({ toggleSidebar }: { toggleSidebar: any }) => (
  <div className="flex justify-between items-center">
    <div className="md:hidden flex py-2 px-3 bg-slate-50 rounded-full  border-2 border-gray-200 hover:shadow-md items-center transition duration-300">
      <FiAlignJustify
        className="md:hidden cursor-pointer w-5 h-5 text-gray-500 hover:text-blue transition duration-300"
        onClick={toggleSidebar}
      />
    </div>
    <div className="flex-shrink-0">
      <Link href="/" legacyBehavior>
        <Image className="cursor-pointer" src={Logo} alt="Logo" width={120} />
      </Link>
    </div>
  </div>
);
