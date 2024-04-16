import React, { useRef, useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSpring, animated } from "react-spring";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Input from "@/app/components/Global/Input";
import Button from "@/app/components/Global/Button";

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
  const [showLogin, setShowLogin] = useState(true);
  const [showResendEmail, setShowResendEmail] = useState(false);

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

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setHighlightEmptyFields(true);
      setError("error.missing_fields");
      return;
    }

    try {
      const responseNextAuth = await signIn("credentials", {
        email,
        password,
        redirect: false,
        credentials: "include",
      });

      if (responseNextAuth?.error) {
        setError("error." + responseNextAuth.error);

        if (responseNextAuth.error === "account_not_activated") {
          setShowLogin(false);
          setShowResendEmail(true);
        }

        return;
      }

      router.push("/");
      onClose();
    } catch (error) {
      setError("error.login_error");
    }
  };

  const handleRegisterClick = () => {
    onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-black opacity-50" />
          <animated.div
            ref={modalRef}
            style={modalSpringProps}
            className="bg-white absolute px-6 py-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-1xl shadow-md overflow-hidden max-w-md w-full flex flex-col items-center"
          >
            <div className="text-blue flex justify-end w-full">
              <IoMdClose className="w-6 h-6 cursor-pointer" onClick={onClose} />
            </div>
            <h1 className="text-3xl text-blue font-semibold text-center">
              {t("Title")}
            </h1>
            <h1 className="text-sm text-[#333333] my-4 text-center">
              {t("Subtitle")}
            </h1>
            <form
              onSubmit={handleLogin}
              className="mx-auto justify-center w-full flex flex-col items-center"
            >
              <Input
                label={t("Fields.Email")}
                type="text"
                value={email}
                onChange={setEmail}
                highlightEmpty={highlightEmptyFields}
                hasError={!!error}
                placeholder={t("Placeholders.Email")}
                className="w-[300px]"
              />
              <Input
                label={t("Fields.Password")}
                type="password"
                value={password}
                onChange={setPassword}
                highlightEmpty={highlightEmptyFields}
                hasError={!!error}
                placeholder={t("Placeholders.Password")}
                className="w-[300px]"
              />
              {error && (
                <p className="text-center rounded-md text-red-500 mb-2 p-2 text-sm">
                  {t(error)}
                </p>
              )}
              {showLogin && (
                <Button
                  label={t("Button.Login")}
                  onClick={(e) => handleLogin(e)}
                  className="max-w-[120px]"
                />
              )}
              {showResendEmail && (
                <Button
                  label={t("Button.ResendEmail")}
                  onClick={(e) => handleLogin(e)}
                  className="max-w-[120px]"
                />
              )}
              <div className="flex justify-center items-center bg-white py-4 w-full">
                <Link
                  href={`/${locale}/forgot-password`}
                  passHref
                  legacyBehavior
                >
                  <a
                    className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                    onClick={onClose}
                  >
                    {t("Links.ForgotPassword")}
                  </a>
                </Link>
              </div>
            </form>
            <div className="mx-auto flex flex-col justify-center items-center">
              <hr className="border-[#000000]/20 w-[300px]" />
              <p className="my-4 text-sm">
                {t("Links.NoAccount")}{" "}
                <Link href="/register" legacyBehavior>
                  <span
                    className="underline hover:text-blue text-center cursor-pointer text-[#333333]/50"
                    onClick={handleRegisterClick}
                  >
                    {t("Links.Register")}
                  </span>
                </Link>{" "}
              </p>
            </div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
