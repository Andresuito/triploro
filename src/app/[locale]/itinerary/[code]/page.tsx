/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { IoCloudUploadOutline } from "react-icons/io5";
import CustomToast from "@/app/components/CustomToast";
import { ItineraryType } from "@/types/itineraryType";
import { formatRangeDate } from "@/app/utils/formatDate";
import Image from "next/image";

type Props = {
  params: { code: string; locale: string };
};

export default function Itinerary({ params }: Props) {
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const getItinerary = async () => {
      try {
        if (session?.user?.id) {
          const response = await axiosInstance.get(
            `/itinerary/${params.code}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );

          if (response.status === 200 && response.data) {
            setItinerary(response.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getItinerary();
  }, [session, params.code]);

  const handleUpload = async () => {
    if (image && session?.user?.id) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        setUploading(true);

        const response = await axiosInstance.patch(
          `/itinerary/update/image/${params.code}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          CustomToast({ message: "Image loaded correctly.", isError: false });
        } else {
          CustomToast({ message: "Failed to upload image", isError: true });
        }
      } catch (error) {
        console.error(error);
        CustomToast({ message: "Failed to upload image", isError: true });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    let files = e.dataTransfer.files;

    if (files.length) {
      let file = files[0];

      if (
        file.type.startsWith("image/") &&
        (file.type.endsWith("png") || file.type.endsWith("jpeg")) &&
        file.size <= 1048576
      ) {
        file = new File([file], file.name.replace(/\s/g, "_"), {
          type: file.type,
        });
        setImage(file);
      } else {
        CustomToast({
          message: "Please upload a PNG or JPEG image of size less than 1MB",
          isError: true,
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;

    if (files?.length) {
      let file = files[0];

      if (
        file.type.startsWith("image/") &&
        (file.type.endsWith("png") || file.type.endsWith("jpeg")) &&
        file.size <= 1048576
      ) {
        file = new File([file], file.name.replace(/\s/g, "_"), {
          type: file.type,
        });
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        CustomToast({
          message: "Please upload a PNG or JPEG image of size less than 1MB",
          isError: true,
        });
      }
    }
  };

  return (
    <>
      {itinerary && (
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-16">
            <div className="mt-10 w-96">
              {itinerary.imageUrl && (
                <div className="flex justify-center relative">
                  <Image
                    src={
                      previewUrl
                        ? previewUrl
                        : `https://triploro.es${itinerary.imageUrl}`
                    }
                    alt={itinerary.city}
                    width={400}
                    height={300}
                    className="w-96 h-[300px] object-fill rounded-t-1xl opacity-90"
                  />
                  <p
                    className="absolute bottom-1 right-1 text-sm text-white cursor-pointer rounded-md hover:bg-blue px-1 duration-150 transition"
                    onClick={() => setShowUpload(true)}
                  >
                    Edit Cover Photo
                  </p>
                  {showUpload && (
                    <div className="absolute flex items-center justify-center w-full h-full">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-full border-2 ${
                          image
                            ? "border-blue hover:border-blue/80 border-solid text-blue hover:text-blue/80"
                            : "border-blue hover:border-0 border-dashed"
                        } rounded cursor-pointer ${
                          image
                            ? "bg-white/20 border-0"
                            : "bg-white/70 hover:bg-blue/80"
                        } text-blue hover:text-white transition duration-75`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <IoCloudUploadOutline className="text-2xl mb-1" />
                        <p className="mb-1 text-xs">
                          <span className="font-semibold">Click or Drop</span>
                        </p>
                        <p className="text-xs">PNG, JPG (MAX. 800x400px)</p>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      {/* <button
                        className="mt-2 bg-blue text-white rounded px-2 py-1 text-sm"
                        onClick={async () => {
                          await handleUpload();
                          setShowUpload(false);
                        }}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button> */}
                    </div>
                  )}
                </div>
              )}
              <div className="p-5 border-t-0 border-2 border-blue/50 rounded-b-1xl shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-3xl text-blue font-semibold">
                    {itinerary.city}
                  </p>
                  <p className="p-1 px-1 text-xs bg-blue text-white w-fit rounded-md">
                    {itinerary.code}
                  </p>
                </div>
                <div className="flex mt-6 space-x-20 text-1xl text-center text-blue">
                  <div className="flex flex-col">
                    <p>
                      {
                        formatRangeDate(
                          itinerary.startDate,
                          itinerary.endDate
                        ).split(" ")[0]
                      }
                    </p>
                    <p className="-mt-2">
                      {
                        formatRangeDate(
                          itinerary.startDate,
                          itinerary.endDate
                        ).split(" ")[1]
                      }
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p>{itinerary.days}</p>
                    <p className="-mt-2">Dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
