import React, { useState } from "react";

export const NotificationsSection = ({
  title,
  description,
  info,
}: {
  title: string;
  description: string;
  info: {
    receiveNewsletter: boolean;
    receiveNewDestination: boolean;
  };
}) => {
  const [receiveNewsletter, setReceiveNewsletter] = useState(
    info.receiveNewsletter
  );
  const [receiveNewDestination, setReceiveNewDestination] = useState(
    info.receiveNewDestination
  );

  const handleOptionChange = (
    setOption: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setOption((prev) => !prev);
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">{title}</h1>
      <span className="block mb-4">{description}</span>
      <div className="space-y-2 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
          <div>
            <p className="text-gray-700 font-semibold mb-1">
              Boletin de Noticias
            </p>
            <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
              Recibiras un correo electronico con informacion sobre las mejoras
              que estamos trabajando en nuestro sitio web, itinerarios y
              destinos populares.
            </span>
          </div>
          <label
            htmlFor="option0"
            className="flex items-center cursor-pointer mt-2 sm:mt-0"
          >
            <div className="relative">
              <input
                id="option0"
                type="checkbox"
                className="sr-only"
                checked={receiveNewsletter}
                onChange={() => handleOptionChange(setReceiveNewsletter)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition duration-150 ${
                  receiveNewsletter ? "bg-blue-600" : "bg-gray-600"
                }`}
              ></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
          <div>
            <p className="text-gray-700 font-semibold mb-1">Nuevos destinos</p>
            <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
              Recibiras un correo electronico cuando agregremos nuevos destinos
              a nuestro sitio web.
            </span>
          </div>
          <label
            htmlFor="option1"
            className="flex items-center cursor-pointer mt-2 sm:mt-0"
          >
            <div className="relative">
              <input
                id="option1"
                type="checkbox"
                className="sr-only"
                checked={receiveNewDestination}
                onChange={() => handleOptionChange(setReceiveNewDestination)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition duration-150 ${
                  receiveNewDestination ? "bg-blue-600" : "bg-gray-600"
                }`}
              ></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
