import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import help1 from "@/app/assets/help-1.jpg";
import help2 from "@/app/assets/help-2.jpg";
import help3 from "@/app/assets/help-3.jpg";
import help4 from "@/app/assets/help-4.jpg";

export default function Page({ params }: { params: { slug: string } }) {
  const t = useTranslations("Help");

  const articles = [
    {
      slug: "how-make-your-trip",
      image: help1,
      alt: "Topics.Help1",
      title: "Topics.Help1",
      content: (
        <div className="flex flex-col md:flex-row my-20">
          <div className="md:w-1/2 md:mr-8 text-base">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {t("Article1.Title")}
              <span className="bg-blue text-white px-2 rounded">
                {" "}
                {t("Article1.TitleTriploro")}
              </span>
            </h1>
            <p className="my-5">{t("Article1.Paragraph1")}</p>
            <p className="my-5">{t("Article1.Paragraph2")}</p>
            <Link href="/register" legacyBehavior>
              <p className="text-blue underline underline-offset-2 cursor-pointer">
                {t("Article1.Paragraph3")}
              </p>
            </Link>
          </div>
          <div className="md:w-1/2 mt-5 md:mt-0">
            <Image
              src={help1}
              alt="Topics.Help1"
              placeholder="blur"
              className="rounded-md w-full h-72 object-cover object-top shadow-xl"
            />
          </div>
        </div>
      ),
    },
    {
      slug: "itineraries-in-triploro",
      image: help2,
      alt: "Topics.Help2",
      title: "Topics.Help2",
      content: (
        <div className="flex flex-col md:flex-row my-20">
          <div className="md:w-1/2 md:mr-8 text-base">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {t("Article2.Title")}
              <span className="bg-blue text-white px-2 rounded">
                {" "}
                {t("Article2.TitleTriploro")}
              </span>
            </h1>
            <p className="my-5">{t("Article2.Paragraph1")}</p>
            <p className="my-5">{t("Article2.Paragraph2")}</p>
            <p>{t("Article2.Paragraph3")}</p>
          </div>
          <div className="md:w-1/2 mt-5 md:mt-0">
            <Image
              src={help2}
              alt="Topics.Help1"
              placeholder="blur"
              className="rounded-md w-full h-72 object-cover object-top shadow-xl"
            />
          </div>
        </div>
      ),
    },
    {
      slug: "share-your-experiences",
      image: help3,
      alt: "Topics.Help3",
      title: "Topics.Help3",
    },
    {
      slug: "how-travel-with-friends",
      image: help4,
      alt: "Topics.Help4",
      title: "Topics.Help4",
      content: (
        <div className="flex flex-col md:flex-row my-20">
          <div className="md:w-1/2 md:mr-8 text-base">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {t("Article4.Title")}
              <span className="bg-blue text-white px-2 rounded">
                {" "}
                {t("Article4.TitleTriploro")}
              </span>
            </h1>
            <p className="my-5">{t("Article4.Paragraph1")}</p>
            <p className="my-5">{t("Article4.Paragraph2")}</p>
            <p>{t("Article4.Paragraph3")}</p>
          </div>
          <div className="md:w-1/2 mt-5 md:mt-0">
            <Image
              src={help4}
              alt="Topics.Help1"
              placeholder="blur"
              className="rounded-md w-full h-72 object-cover object-top shadow-xl"
            />
          </div>
        </div>
      ),
    },
  ];

  const article = articles.find((article) => article.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mt-8 md:mt-16">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              ¿{t(article.title)}?
            </h1>
            <Link legacyBehavior href="/help">
              <a className="hover:text-blue duration-200 transition">
                {t("Buttons.Back")}
              </a>
            </Link>
          </div>
          {article.content}
        </div>
      </div>
    </>
  );
}
