import React, { useRef, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSpring, animated } from "react-spring";
import { GB, ES, PT } from "country-flag-icons/react/3x2";
import { useLocale, useTranslations } from "next-intl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, onClose }) => {
  const t = useTranslations("ModalLang");
  const locale = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setCurrentPath(window.location.pathname);
    }
  }, [open]);

  const modalSpringProps = useSpring({
    transform: open
      ? "translate(-50%, -50%) scale(1)"
      : "translate(-50%, -50%) scale(0)",
    opacity: open ? 1 : 0,
    config: { tension: 400, friction: 30 },
  });

  const handleLanguageChange = (nextLocale: string) => {
    const currentPathWithoutLocale = currentPath.replace(`/${locale}`, "");
    router.replace(`/${nextLocale}${currentPathWithoutLocale}`);
    onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-black bg-opacity-0 absolute inset-0" />
          <animated.div
            ref={modalRef}
            style={modalSpringProps}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4  md:max-w-md rounded-lg shadow-md pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold"> {t("Title")}</h2>
              <IoMdClose
                className="w-6 h-6 ml-6 cursor-pointer text-gray-400 hover:text-sky-900 transition duration-200"
                onClick={onClose}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 text-base">
              <button
                className={`rounded-md flex items-center p-3 cursor-pointer hover:bg-sky-100 transition duration-200 ${
                  locale === "en" ? "border border-sky-900" : ""
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                <GB className="w-6 h-6 mr-2" />
                {t("Option1")}
              </button>
              <button
                className={`rounded-md flex items-center p-3 cursor-pointer hover:bg-sky-100 transition duration-200 ${
                  locale === "es" ? "border border-sky-900" : ""
                }`}
                onClick={() => handleLanguageChange("es")}
              >
                <ES className="w-6 h-6 mr-2" />
                {t("Option2")}
              </button>
              <button
                className={`rounded-md flex items-center p-3 cursor-pointer hover:bg-sky-100 transition duration-200 ${
                  locale === "pt" ? "border border-sky-900" : ""
                }`}
                onClick={() => handleLanguageChange("pt")}
              >
                <PT className="w-6 h-6 mr-2" />
                {t("Option3")}
              </button>
            </div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default Modal;
