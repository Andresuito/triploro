import React from "react";
import Link from "next/link";

export const NavbarLinks = ({
  t,
  handleNavLinkClick,
}: {
  t: any;
  handleNavLinkClick: any;
}) => (
  <div className="hidden md:flex flex-grow justify-center items-center">
    <div className="flex items-baseline space-x-4">
      <Link legacyBehavior href="/itineraries">
        <a
          className="px-3 py-2 hover:bg-blue/80 hover:text-white rounded-1xl"
          onClick={handleNavLinkClick}
        >
          {t("Options.Option3")}
        </a>
      </Link>
      <a
        href="#"
        className="px-3 py-2 hover:bg-blue/80 hover:text-white rounded-1xl"
        onClick={handleNavLinkClick}
      >
        {t("Options.Option2")}
      </a>
      <Link legacyBehavior href="/destinations">
        <a
          className="px-3 py-2 hover:bg-blue/80 hover:text-white rounded-1xl"
          onClick={handleNavLinkClick}
        >
          {t("Options.Option1")}
        </a>
      </Link>
    </div>
  </div>
);
