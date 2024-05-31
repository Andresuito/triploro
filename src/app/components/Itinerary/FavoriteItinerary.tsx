import React, { useState, useEffect, useCallback } from "react";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useSpring, animated } from "react-spring";
import { useSession } from "next-auth/react";
import axiosInstance from "@/app/utils/axiosInstance";

type Props = {
  code: string;
};

const FavoriteItinerary = ({ code }: Props) => {
  const { data: session } = useSession();
  const [isFilled, setIsFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    if (session) {
      try {
        const response = await axiosInstance.get(
          `/itinerary/favorite/${code}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setIsFilled(response.data.isFavorite);
      } catch (error) {
        console.error(error);
      }
    }
  }, [session, code]);

  const handleHeartClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!session) {
      window.location.href = "/?modaLogin=open";
      return;
    }

    setLoading(true);
    try {
      if (isFilled) {
        await axiosInstance.delete(`/itinerary/favorite/${code}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
        setIsFilled(false);
      } else {
        await axiosInstance.post(
          `/itinerary/favorite/${code}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setIsFilled(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const animation = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1.1)" },
    reset: true,
  });

  return isFilled ? (
    <animated.div style={animation}>
      <IoMdHeart
        className="text-2xl cursor-pointer text-red-500"
        onClick={handleHeartClick}
      />
    </animated.div>
  ) : (
    <animated.div style={animation}>
      <IoIosHeartEmpty
        className="text-2xl text-white cursor-pointer"
        onClick={handleHeartClick}
      />
    </animated.div>
  );
};

export default FavoriteItinerary;
