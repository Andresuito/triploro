import React, { useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useSpring, animated } from "react-spring";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const ModalWindow: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  content,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
      document.body.classList.add("overflow-hidden");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("overflow-hidden");
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
              <h2 className="text-lg font-semibold">{title}</h2>
              <IoMdClose
                className="w-6 h-6 ml-6 cursor-pointer text-gray-400 hover:text-blue transition duration-200"
                onClick={onClose}
              />
            </div>
            {content}
          </animated.div>
        </div>
      )}
    </>
  );
};

export default ModalWindow;
