import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import help1 from "@/app/assets/help-1.jpg";
import help2 from "@/app/assets/help-2.jpg";
import help3 from "@/app/assets/help-3.jpg";
import help4 from "@/app/assets/help-4.jpg";

const Guides = () => {
  const t = useTranslations("Help");

  const helpItems = [
    {
      slug: "how-make-your-trip",
      image: help1,
      alt: t("Topics.Help1"),
      title: t("Topics.Help1"),
    },
    {
      slug: "itineraries-in-triploro",
      image: help2,
      alt: t("Topics.Help2"),
      title: t("Topics.Help2"),
    },
    {
      slug: "share-your-experiences",
      image: help3,
      alt: t("Topics.Help3"),
      title: t("Topics.Help3"),
    },
    {
      slug: "how-travel-with-friends",
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
            <span className="bg-blue px-1 text-white rounded-md">Triploro</span>
          </h2>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {helpItems.map((item, index) => (
          <div key={index}>
            <Link href={`/help/${item.slug}`} legacyBehavior>
              <a>
                <Image
                  src={item.image}
                  alt={item.alt}
                  placeholder="blur"
                  className="rounded-md w-full h-60 object-cover object-top shadow-xl"
                />
                <h1 className="mt-2 cursor-pointer hover:text-blue duration-200 transition">
                  {item.title}
                </h1>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Guides;
