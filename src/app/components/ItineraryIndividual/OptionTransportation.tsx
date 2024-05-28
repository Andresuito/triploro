import { FaCar, FaUtensils, FaHotel, FaLandmark } from "react-icons/fa";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { MdLocalActivity } from "react-icons/md";
import { PiParkFill } from "react-icons/pi";

const options = [
  { icon: BiSolidPlaneAlt, tooltip: "Transporte Aéreo" },
  { icon: FaUtensils, tooltip: "Restaurantes" },
  { icon: FaHotel, tooltip: "Hoteles" },
  { icon: MdLocalActivity, tooltip: "Actividades" },
  { icon: FaLandmark, tooltip: "Lugares de Interés" },
  { icon: PiParkFill, tooltip: "Parques" },
];

export const OptionTransportation = () => {
  return (
    <>
      {options.map((option, index) => (
        <div
          key={index}
          className={`relative flex justify-center items-center text-white bg-blue w-10 h-10 rounded-full shadow-lg cursor-pointer group hover:bg-white hover:border-2 hover:border-blue hover:text-blue transition duration-200 ${
            index === 0 ? "mr-2" : "mx-2"
          }`}
        >
          <option.icon className="transition duration-200 group-hover:scale-150" />
        </div>
      ))}
    </>
  );
};
