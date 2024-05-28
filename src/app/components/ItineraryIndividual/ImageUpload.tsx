import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "@/app/utils/axiosInstance";
import { useSession } from "next-auth/react";
import Toast from "@/app/components/Global/Toast";
import { useTranslations } from "next-intl";

export const ImageUpload = ({
  itineraryCode,
  showUpload,
  setShowUpload,
  setPreviewUrl,
  setItinerary,
}: {
  itineraryCode: string;
  showUpload: boolean;
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
  setItinerary: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const t = useTranslations("Itinerary");
  const { data: session } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleUpload = async () => {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          setUploading(true);

          const response = await axiosInstance.patch(
            `/itinerary/update/image/${itineraryCode}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );

          if (response.status === 200) {
            Toast({ message: t("Succees.ImageChanged"), isError: false });
            const newImageUrl = URL.createObjectURL(image);
            setPreviewUrl(newImageUrl);
            setItinerary((prevState: any) =>
              prevState ? { ...prevState, imageUrl: newImageUrl } : null
            );
            setImage(null);
            setShowUpload(false);
          } else {
            Toast({ message: t("Errors.FileUpload"), isError: true });
          }
        } catch (error) {
          console.error(error);
          Toast({ message: t("Errors.FileUpload"), isError: true });
        } finally {
          setUploading(false);
        }
      }
    };

    if (image) {
      handleUpload();
    }
  }, [
    image,
    itineraryCode,
    session,
    setPreviewUrl,
    setItinerary,
    setImage,
    setShowUpload,
  ]);

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = async (e: any) => {
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
        Toast({
          message: t("Errors.ExtensionFile"),
          isError: true,
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = async (e: any) => {
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
      } else {
        Toast({
          message: t("Errors.ExtensionFile"),
          isError: true,
        });
      }
    }
  };

  return (
    showUpload && (
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
            <span className="font-semibold">
              {t("Buttons.NewImageDropOrClick")}
            </span>
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
    )
  );
};
