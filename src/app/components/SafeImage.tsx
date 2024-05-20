import React from "react";
import Image, { ImageProps } from "next/image";
import NotImage from "@/app/assets/pattern.svg";

interface SafeImageProps extends ImageProps {
  src: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, ...props }) => {
  const [safeSrc, setSafeSrc] = React.useState(src);

  const handleError = () => {
    setSafeSrc(NotImage);
  };

  return <Image alt={alt} src={safeSrc} onError={handleError} {...props} />;
};

export default SafeImage;
