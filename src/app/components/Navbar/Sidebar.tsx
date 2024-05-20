import React from "react";
import { useSpring, animated } from "react-spring";
import Link from "next/link";

export const Sidebar = ({
  isSidebarOpen,
  handleNavLinkClick,
  t,
}: {
  isSidebarOpen: boolean;
  handleNavLinkClick: () => void;
  t: any;
}) => {
  const slideIn = useSpring({
    transform: isSidebarOpen ? "translateX(0%)" : "translateX(-100%)",
    config: { tension: 500, friction: 50 },
  });

  return (
    isSidebarOpen && (
      <animated.div
        style={slideIn}
        className="md:hidden bg-slate-50 h-fit w-full absolute top-20 left-0 z-50"
      >
        <div className="flex flex-col divide-y divide-slate-150">
          <Link legacyBehavior href="/itineraries">
            <a className="px-3 py-4 font-medium" onClick={handleNavLinkClick}>
              {t("Options.Option3")}
            </a>
          </Link>
          <Link legacyBehavior href="#">
            <a className="px-3 py-4 font-medium" onClick={handleNavLinkClick}>
              {t("Options.Option2")}
            </a>
          </Link>
          <Link legacyBehavior href="/destinations">
            <a className="px-3 py-4 font-medium" onClick={handleNavLinkClick}>
              {t("Options.Option1")}
            </a>
          </Link>
        </div>
      </animated.div>
    )
  );
};
