/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { IoCloudUploadOutline } from "react-icons/io5";
import CustomToast from "@/app/components/CustomToast";
import { ItineraryType } from "@/types/itineraryType";

type Props = {
  params: { code: string; locale: string };
};

export default function Itinerary({ params }: Props) {
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        setPreviewUrl(URL.createObjectURL(file));
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
            <div className="lg:text-center">
              <h2 className="text-2xl text-blue font-semibold tracking-wide uppercase">
                {itinerary.city}
              </h2>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Días
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {itinerary.days}
                  </dd>
                </div>

                <div className="relative">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Inicio
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {itinerary.startDate}
                  </dd>
                </div>

                <div className="relative">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Fin
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {itinerary.endDate}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
                    image
                      ? "border-blue hover:border-blue/80 border-solid text-blue hover:text-blue/80"
                      : "border-blue hover:border-0 border-dashed"
                  } rounded-lg cursor-pointer ${
                    image ? "bg-white border-0" : "bg-gray-50 hover:bg-blue/80"
                  } text-blue hover:text-white transition duration-75`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-25 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <IoCloudUploadOutline className="text-3xl mb-3" />
                      <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs">PNG, JPG (MAX. 800x400px)</p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <button
                className="mt-4 bg-blue text-white rounded px-4 py-2"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
