import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSpring, animated } from "react-spring";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Input from "../components/Global/Input";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const t = useTranslations("Auth.Login");
  const locale = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [highlightEmptyFields, setHighlightEmptyFields] = useState(false);

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

  const modalSpringProps = useSpring({
    transform: open
      ? "translate(-50%, -50%) scale(1)"
      : "translate(-50%, -50%) scale(0)",
    opacity: open ? 1 : 0,
    config: { tension: 400, friction: 30 },
  });

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const responseNextAuth = await signIn("credentials", {
        email,
        password,
        redirect: false,
        credentials: "include",
      });

      if (responseNextAuth?.error) {
        setError(responseNextAuth.error);
        return;
      }

      router.push("/");
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      setError("login_error");
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-black opacity-50" />
          <animated.div
            ref={modalRef}
            style={modalSpringProps}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-md overflow-hidden max-w-md w-full"
          >
            <div className="bg-sky-900 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t("Title")}</h2>
              <IoMdClose className="w-6 h-6 cursor-pointer" onClick={onClose} />
            </div>
            <form onSubmit={handleLogin} className="p-6 bg-white">
              <Input
                label={t("Email")}
                type="text"
                value={email}
                onChange={setEmail}
                highlightEmpty={highlightEmptyFields}
                placeholder={t("EmailPlaceholder")}
              />
              <Input
                label={t("Password")}
                type="password"
                value={password}
                onChange={setPassword}
                highlightEmpty={highlightEmptyFields}
                placeholder={t("PasswordPlaceholder")}
              />
              {error && <p className="text-red-500 text-sm mb-4">{t(error)}</p>}
              <button
                type="submit"
                className="bg-gray-500 text-white w-full py-2 rounded-md hover:bg-sky-900 focus:outline-none transition duration-200"
              >
                {t("Button")}
              </button>
            </form>
            <div className="flex justify-center items-center bg-white py-4">
              <p
                className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={onClose}
              >
                {t("Forgot_Link")}
              </p>
            </div>
            <div className="flex justify-center items-center bg-sky-900 py-4">
              <p className="text-sm text-white">
                {t("Link")}{" "}
                <Link href={`/${locale}/register`} passHref legacyBehavior>
                  <a onClick={onClose}>{t("Register_Link")}</a>
                </Link>
              </p>
            </div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
