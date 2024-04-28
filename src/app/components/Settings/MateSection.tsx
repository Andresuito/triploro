import React, { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { formatDate } from "@/app/utils/formatDate";
import axiosInstance from "@/app/utils/axiosInstance";
import ModalWindow from "@/app/components/ModalWindow";
import Button from "@/app/components/Global/Button";

interface User {
  id: string;
  username: string;
}

interface MateSectionProps {
  title: string;
  description: string;
}

interface Friend {
  id: string;
  username: string;
  createdAt: string;
}

export const MateSection = ({ title, description }: MateSectionProps) => {
  const { data: session } = useSession();
  const t = useTranslations("Settings");

  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendStatus, setFriendStatus] = useState<Record<string, boolean>>({});
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  const fetchPendingRequests = async () => {
    try {
      const response = await axiosInstance.get(
        `/friendship/pending-requests/${session?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      setPendingRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
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

  const acceptFriendRequest = async (id: string) => {
    try {
      await axiosInstance.post(
        `/friendship/accept-request/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const rejectFriendRequest = async (id: string) => {
    try {
      await axiosInstance.post(
        `/friendship/reject-request/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const deleteFriend = async (event: FormEvent, id: string) => {
    event.preventDefault();
    try {
      await axiosInstance.delete(`/friendship/delete-friend/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setIsModalOpen(false);
      fetchFriends();
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <span>{description}</span>
      <div className="pb-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
          <div>
            <p className="text-gray-700 font-semibold mb-1">
              {t("MateSection.Subtitle2")}
            </p>
            <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
              {t("MateSection.InfoAddMate")}
            </span>
            <div className="flex items-center mt-4 w-fit">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={t("MateSection.Fields.Username")}
                className="p-2 border rounded-1xl mr-2"
              />
              <Button
                label={t("MateSection.Buttons.AddMate")}
                className="w-fit text-white rounded-1xl px-2"
                onClick={() => {
                  handleSearchClick();
                  handleAddMateClick();
                }}
              />
            </div>
            {searchError && (
              <div className="text-red-500 mt-2">{searchError}</div>
            )}
            {showInput && searchResults && (
              <div className="flex flex-col items-center mt-2 space-y-4">
                <div className="bg-white shadow-lg rounded-1xl w-80 p-2 flex items-center">
                  <div className="h-10 w-10 bg-blue text-white rounded-full flex items-center justify-center mr-4">
                    {searchResults.username[0].toUpperCase()}
                  </div>
                  <div className="justify-between flex-grow">
                    <div className="flex justify-between items-center">
                      <h1 className="text-base text-gray-800">
                        @{searchResults.username}
                      </h1>
                      {!friendStatus[searchResults.id] && !pendingRequest && (
                        <FaUserPlus
                          className="w-5 cursor-pointer text-blue hover:text-blue transition duration-200"
                          onClick={sendFriendRequest}
                        />
                      )}
                    </div>
                    <p className="text-sm text-333333 opacity-50">
                      {friendStatus[searchResults.id]
                        ? t("MateSection.Status.isFriend")
                        : pendingRequest
                        ? t("MateSection.Status.pending")
                        : t("MateSection.Status.isNotFriend")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200 py-2">
            <div>
              <p className="text-gray-700 font-semibold mb-1">
                {t("MateSection.TitleRequestsPending")}
              </p>
              <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
                {t("MateSection.InfoRequestsPending")}
              </span>
              <div className="flex flex-wrap mt-2">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id}>
                      <div
                        key={request.username}
                        className="bg-white text-blue w-fit rounded-1xl shadow-lg overflow-hidden mb-4 mr-4"
                      >
                        <div className="p-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue text-white rounded-full flex items-center justify-center mr-4">
                              {request.username[0].toUpperCase()}
                            </div>
                            <div>
                              <h1 className="text-base">{request.username}</h1>
                              <p className="text-sm text-333333 opacity-50">
                                {t("MateSection.Status.beFriend")}
                              </p>
                            </div>
                            <div className="flex flex-col space-y-1 ml-2">
                              <Button
                                label={t("MateSection.Buttons.Reject")}
                                onClick={() => rejectFriendRequest(request.id)}
                                className="bg-gray-500 rounded-1xl text-[12px] py-[2px] px-2"
                              />
                              <Button
                                label={t("MateSection.Buttons.Accept")}
                                onClick={() => acceptFriendRequest(request.id)}
                                className="bg-blue rounded-1xl text-[12px] py-[2px] px-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-700 text-opacity-50">
                    {t("MateSection.InfoNoRequestsPending")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex flex-col sm:flex-row items-start py-2">
            <div>
              <p className="text-gray-700 font-semibold mb-1">
                {t("MateSection.TitleFriends")}
              </p>
              <span className="text-sm text-gray-700 text-opacity-50 hover:text-black transition duration-150">
                {t("MateSection.InfoFriends")}
              </span>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                {friends.length > 0 &&
                  friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-white shadow-lg rounded-1xl w-fit p-2 flex items-center"
                    >
                      <div className="h-10 w-10 bg-blue text-white rounded-full flex items-center justify-center mr-4">
                        {friend.username[0].toUpperCase()}
                      </div>
                      <div>
                        <FaUserMinus
                          onClick={() => {
                            setSelectedUser(friend);
                            setIsModalOpen(true);
                          }}
                          className="float-right cursor-pointer text-blue opacity-60 hover:opacity-100 transition duration-200"
                        />

                        <div className="justify-between flex-grow">
                          <div className="flex justify-between items-center">
                            {" "}
                            <h1 className="text-base">{friend.username}</h1>
                          </div>
                          <p className="text-sm text-333333 opacity-50">
                            {t("MateSection.FriendSince")}{" "}
                            {formatDate(friend.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalWindow
        open={isModalOpen}
        title="Borrar amigo"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        content={
          <div>
            <h1>
              {t("MateSection.Modal.Title")}{" "}
              <strong>{selectedUser?.username}</strong>
            </h1>
            <div className="flex mt-2 space-x-3">
              <Button
                label={t("MateSection.Modal.Buttons.Cancel")}
                className="opacity-50 hover:opacity-100"
                onClick={() => setIsModalOpen(false)}
              />
              <Button
                label={t("MateSection.Modal.Buttons.Delete")}
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedUser) {
                    deleteFriend(e, selectedUser.id);
                  }
                }}
                className="bg-red-500 opacity-50 hover:opacity-100 text-white"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
