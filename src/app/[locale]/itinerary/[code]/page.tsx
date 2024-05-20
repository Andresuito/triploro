/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import Toast from "@/app/components/Global/Toast";
import type { Itinerary } from "@/types/itineraryType";
import { formatRangeDate } from "@/app/utils/formatDate";
import { useRouter } from "next/navigation";

import Spinner from "@/app/components/Global/Spinner";
import SafeImage from "@/app/components/SafeImage";
import NotImage from "@/app/assets/pattern.svg";

type Props = {
  params: { code: string; locale: string };
};

export default function Itinerary({ params }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (image) {
      handleUpload();
    }
  }, [image]);

  useEffect(() => {
    const getItinerary = async () => {
      setIsLoading(true);
      try {
        let response;

        if (session?.user?.token) {
          try {
            response = await axiosInstance.get(`/itinerary/${params.code}`, {
              headers: {
                Authorization: `Bearer ${session.user.token}`,
              },
            });
          } catch (privateError: any) {
            if (privateError.response && privateError.response.status === 403) {
              response = await axiosInstance.get(
                `/itinerary/public/${params.code}`
              );
            } else {
              throw privateError;
            }
          }
        } else {
          response = await axiosInstance.get(
            `/itinerary/public/${params.code}`
          );
        }

        if (response.status === 200 && response.data) {
          setItinerary(response.data);
        }
      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 404) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getItinerary();
  }, [params.code, router, session?.user?.token]);

  const handleUpload = async () => {
    if (image) {
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
          Toast({ message: "Image uploaded correctly.", isError: false });
          setPreviewUrl(URL.createObjectURL(image));
          setImage(null);
          setShowUpload(false);
        } else {
          Toast({ message: "Failed to upload image", isError: true });
        }
      } catch (error) {
        console.error(error);
        Toast({ message: "Failed to upload image", isError: true });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
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
        await handleUpload();
      } else {
        Toast({
          message: "Please upload a PNG or JPEG image of size less than 1MB",
          isError: true,
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        await handleUpload();
      } else {
        Toast({
          message: "Please upload a PNG or JPEG image of size less than 1MB",
          isError: true,
        });
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        itinerary && (
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto mt-8 md:mt-16">
              <div className="mt-10 w-96">
                <div className="flex justify-center relative">
                  <SafeImage
                    src={
                      previewUrl
                        ? previewUrl
                        : itinerary.imageUrl
                        ? `https://triploro.es${
                            itinerary.imageUrl
                          }?${new Date().getTime()}`
                        : NotImage
                    }
                    alt={itinerary.city ? itinerary.city : ""}
                    width={400}
                    height={300}
                    className="w-96 h-[300px] object-cover rounded-t-1xl opacity-90"
                  />
                  <p
                    className="absolute bottom-1 right-1 text-xs text-white hover:bg-blue p-1 cursor-pointer rounded-md"
                    onClick={() => setShowUpload(true)}
                  >
                    Edit Cover Photo
                  </p>
                  {showUpload && (
                    <div className="absolute flex items-center justify-center w-full h-full">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-full border-2 ${
                          image
                            ? "border-blue hover:border-blue/80 border-solid text-blue"
                            : "border-blue border-dashed"
                        } rounded cursor-pointer ${
                          image ? "bg-white/20 border-0" : "bg-white/70"
                        } text-blue`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <IoCloudUploadOutline className="text-2xl mb-1" />
                        <p className="mb-1 text-xs">
                          <span className="font-semibold">Click or Drop</span>
                        </p>
                        <p className="text-xs">PNG, JPG (MAX. 380x300px)</p>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <button
                        className="absolute top-2 right-2 text-white bg-blue/50 hover:bg-blue/100 rounded-full px-1 py-1 text-sm"
                        onClick={() => setShowUpload(false)}
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-5 rounded-b-1xl shadow-2xl">
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
        )
      )}
    </>
  );
}
