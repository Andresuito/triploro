import React, { useState, useEffect } from "react";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { useSpring, animated } from "react-spring";
import { useSession } from "next-auth/react";
import axiosInstance from "@/app/utils/axiosInstance";

const FavoriteItinerary = (code: any) => {
  const { data: session } = useSession();
  const [isFilled, setIsFilled] = useState(false);

  const handleHeartClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (!session) {
      window.location.href = "/?modaLogin=open";
    } else {
      setIsFilled(!isFilled);

      if (isFilled) {
        axiosInstance
          .delete(`/itinerary/favorite/${code.code}`, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axiosInstance
          .post(
            `/itinerary/favorite/${code.code}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          )
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  useEffect(() => {
    if (session) {
      axiosInstance
        .get(`/itinerary/favorite/${code.code}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        })
        .then((response) => {
          setIsFilled(response.data.isFavorite);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [session, code.code]);

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
