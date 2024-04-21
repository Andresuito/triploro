import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaUser, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import { useTranslations } from "next-intl";
import axiosInstance from "@/app/utils/axiosInstance";
import triploro from "../../assets/Logo.svg";

interface User {
  id: string;
  username: string;
}

interface MateSectionProps {
  title: string;
  description: string;
  info: any;
}

interface Friend {
  id: string;
  username: string;
  createdAt: string;
}

export const MateSection = ({ title, description, info }: MateSectionProps) => {
  const { data: session } = useSession();
  const t = useTranslations("Settings");

  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendStatus, setFriendStatus] = useState<Record<string, boolean>>({});
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "@") {
      return;
    }
    setSearchTerm(event.target.value.substring(1));
  };

  const handleSearchClick = async () => {
    try {
      const response = await axiosInstance.get(
        `/friendship/users?username=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      setSearchResults(response.data.user);
      setSearchError(null);
      setPendingRequest(response.data.pendingRequest);
    } catch (error: any) {
      if (error.response.data.error === "user_not_found") {
        setSearchError("Usuario no encontrado");
        setSearchResults(null);
      }
      console.error("Error searching users:", error);
    }
  };

  const handleAddMateClick = () => {
    setShowInput(true);
  };

  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get(
        `/friendship/friends/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriendStatus = async () => {
    if (!searchResults) return;

    try {
      const response = await axiosInstance.get(
        `/friendship/is-friend/${searchResults.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      setFriendStatus({ [searchResults.id]: response.data.isFriend });

      if (response.data.pendingRequest) {
        setPendingRequest(true);
      } else {
        setPendingRequest(false);
      }
    } catch (error) {
      console.error("Error checking friend status:", error);
      setFriendStatus({ [searchResults.id]: false });
      setPendingRequest(false);
    }
  };

  useEffect(() => {
    if (searchResults) {
      fetchFriendStatus();
    }
  }, [searchResults]);

  const sendFriendRequest = async () => {
    try {
      if (searchResults) {
        await axiosInstance.post(
          `/friendship/send-request/${searchResults.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );
        setPendingRequest(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
            <div>
              <p className="text-gray-700 font-semibold mb-1">Amigos</p>
              <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
                Aquí se muestran todos tus amigos en Triploro. Puedes invitarlos
                a todos los viajes que desees.
              </span>
              <div className="flex flex-wrap mt-2">
                {friends.length > 0 &&
                  friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-blue/80 text-white w-fit rounded-1xl shadow-lg overflow-hidden mb-4 mr-4"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h1 className="text-base">@{friend.username}</h1>
                          <FaUserMinus className="float-right cursor-pointer" />
                        </div>
                        <p className="text-sm">
                          Sois amigos desde el {formatDate(friend.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start justify-between py-2">
            <div>
              <p className="text-gray-700 font-semibold mb-1">
                Añadir un nuevo amigo
              </p>
              <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
                Para agregar un nuevo amigo, busca su nombre de usuario y haz
                clic en el botón de añadir. Tu amigo recibirá una notificación
                para aceptar tu solicitud.
              </span>
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  value={`@${searchTerm}`}
                  onChange={handleInputChange}
                  placeholder="Buscar usuario"
                  className="p-2 border rounded-1xl mr-2"
                />
                <button
                  className="flex p-2 px-4 cursor-pointer text-blue rounded-1xl hover:bg-blue hover:text-white transition duration-200"
                  onClick={() => {
                    handleSearchClick();
                    handleAddMateClick();
                  }}
                >
                  {t("MateSection.Buttons.AddMate")}
                </button>
              </div>
              {searchError && (
                <div className="text-red-500 mt-2">{searchError}</div>
              )}
              {showInput && searchResults && (
                <div className="flex flex-col items-center mt-2 space-y-4">
                  <div className="bg-white border rounded-1xl w-64 ">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Image src={triploro} alt="Triploro" width={120} />
                        {friendStatus[searchResults.id] ? (
                          <FaUser className="w-5 text-green-700/90" />
                        ) : pendingRequest ? (
                          <FaUser className="w-5 text-orange/90" />
                        ) : (
                          <FaUserPlus
                            className={`w-5 cursor-pointer text-blue hover:text-blue transition duration-200 ${
                              friendStatus[searchResults.id] || pendingRequest
                                ? "pointer-events-none"
                                : ""
                            }`}
                            onClick={sendFriendRequest}
                          />
                        )}
                      </div>
                      <h2 className="text-base text-gray-800 mb-2">
                        @{searchResults.username}
                      </h2>
                      <p className="text-sm">
                        {friendStatus[searchResults.id]
                          ? "Este usuario ya es tu amigo"
                          : pendingRequest
                          ? "Solicitud de amistad pendiente"
                          : "No es tu amigo"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
