import React from "react";
import toast from "react-hot-toast";
import { ToastProps } from "@/types/TypeToast";

const CustomToast: React.FC<ToastProps> = ({ message, isError = false }) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-2xl rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p
              className={`text-sm font-medium ${
                isError ? "text-red-500" : "text-blue"
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue focus:outline-none focus:ring-2 focus:ring-blue"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

export default CustomToast;
