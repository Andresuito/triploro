import Link from "next/link";
import { useTranslations } from "next-intl";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";

import help1 from "@/app/assets/help-1.jpg";
import help2 from "@/app/assets/help-2.jpg";
import help3 from "@/app/assets/help-3.jpg";
import help4 from "@/app/assets/help-4.jpg";

const Guides = () => {
  const t = useTranslations("Help");

  const helpItems = [
    {
      image: help1,
      alt: t("Topics.Help1"),
      title: t("Topics.Help1"),
    },
    {
      image: help2,
      alt: t("Topics.Help2"),
      title: t("Topics.Help2"),
    },
    {
      image: help3,
      alt: t("Topics.Help3"),
      title: t("Topics.Help3"),
    },
    {
      image: help4,
      alt: t("Topics.Help4"),
      title: t("Topics.Help4"),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mt-8 md:mt-16">
        <div>
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-900">
            {t("Title")}{" "}
            <span className="bg-sky-900 px-1 text-white rounded-md">
              Triploro
            </span>
          </h2>
        </div>
        <div className="hidden md:flex items-center">
          <Link legacyBehavior href="/all-articles">
            <a className="hover:text-sky-900 font-semibold duration-200 transition">
              {t("Articles")}
              <MdOutlineKeyboardArrowRight
                className="inline-block ml-1"
                size={20}
              />
            </a>
          </Link>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {helpItems.map((item, index) => (
          <div key={index}>
            <Image
              src={item.image}
              alt={item.alt}
              placeholder="blur"
              className="rounded-md w-full h-60 object-cover object-top shadow-xl"
            />
            <h1 className="font-semibold text-lg mt-2 cursor-pointer hover:text-sky-900 duration-200 transition">
              {item.title}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Guides;
