import React from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import background_itinerary from "@/app/assets/background-itinerary.png";
import NewItinerary from "@/app/components/New/NewItinerary";

export async function generateMetadata() {
  const t = await getTranslations({ namespace: "Metadata" });

  return {
    title: t("New.Title"),
    description: t("New.Description"),
  };
}

const HelpPage = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="relative text-white flex flex-col items-start justify-center h-full">
            <Image
              src={background_itinerary}
              className="w-full rounded-1xl"
              alt="background itinerary"
              placeholder="blur"
            />
            <h1 className="absolute top-0 mt-14 pl-12 text-2xl">
              Creating your own itinerary
            </h1>
            <div className="absolute top-0 left-0 flex flex-col items-start justify-center h-full w-full p-12">
              <h2 className="text-4xl font-semibold w-[399px]">
                Ready to embark on your next trip?
              </h2>
              <p className="text-2xl mt-3">
                With Triploro, you&apos;re in control of every detail.
              </p>
            </div>
            <Link href="/help" legacyBehavior>
              <a className="absolute bottom-0 underline underline-offset-4 mb-12 ml-12 hover:bg-blue align-top px-3 hover:no-underline rounded-1xl duration-300 transition">
                Read More
              </a>
            </Link>
            <div className="absolute top-0 right-0 mt-14">
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mr-12">
                <h1 className="text-2xl">Step 1. Specify Your Trip Details</h1>
                <p className="text-sm mt-[10px]">
                  Begin by specifying your destination, travel dates, number of
                  days, tripmates, and audience setting.
                </p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl">Step 2. Customize Your Experience</h1>
                <p className="text-sm mt-[10px]">
                  Once your trip details are set, dive into customizing your
                  itinerary to perfection. Select activities, attractions,
                  accommodations, transportation, and more to create a
                  personalized travel plan that suits your style and
                  preferences.
                </p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl">Step 3. Add Personal Touches</h1>
                <p className="text-sm mt-[10px]">
                  Make your itinerary truly yours by adding personal notes,
                  photos, and recommendations. Highlight your favorite spots,
                  insider tips, and must-see attractions to ensure an
                  unforgettable adventure.
                </p>
              </div>
              <div className="w-[500px] bg-white bg-opacity-25 hover:bg-blue/80 text-white duration-300 transition rounded-1xl p-6 mt-3 mr-12">
                <h1 className="text-2xl">Step 4. Share Your Adventure</h1>
                <p className="text-sm mt-[10px]">
                  Whether you&apos;re seeking recommendations from fellow
                  travelers or inspiring others with your travel tales, Triploro
                  makes it easy to connect and share experiences.
                </p>
              </div>
            </div>
          </div>
          <NewItinerary />
        </div>
      </div>
    </>
  );
};

export default HelpPage;
