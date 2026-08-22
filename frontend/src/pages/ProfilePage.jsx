import { ProfilePicture } from "../components/profile/Profile";
import apiClient from "../lib/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../lib/store/authStore";

export const ProfilePage = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await apiClient.get("/users/profile");

      const rawUser =
        res.data?.data?.user ||
        res.data?.data?.profile ||
        res.data?.user ||
        res.data?.data ||
        res.data;

      if (!rawUser) {
        throw new Error("User profile was not returned by the server");
      }

      const userData = {
        ...rawUser,
        profilePic:
          rawUser.profilePic ||
          rawUser.avatar ||
          rawUser.avatarUrl ||
          rawUser.image ||
          "",
      };

      setUser((prev) => ({
        ...(prev || {}),
        ...userData,
      }));

      return userData;
    },
    staleTime: 1000 * 60 * 5,
  });

  const userId = user?.id || user?._id;

  const updateUserMutation = useMutation({
    mutationFn: async (payload) => {
      if (!userId) {
        throw new Error("Missing user ID");
      }

      const isFormData = payload instanceof FormData;

      const res = await apiClient.put("/users/profile", payload, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : {},
      });

      return res.data;
    },

    onSuccess: (responseData) => {
      const updatedUser =
        responseData?.data?.user ||
        responseData?.data?.profile ||
        responseData?.user ||
        responseData?.data ||
        responseData;

      if (!updatedUser) return;

      const normalizedUser = {
        ...updatedUser,
        profilePic:
          updatedUser.profilePic ||
          updatedUser.avatar ||
          updatedUser.avatarUrl ||
          updatedUser.image ||
          user?.profilePic ||
          "",
      };

      setUser((prev) => ({
        ...(prev || {}),
        ...normalizedUser,
      }));
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <ProfilePicture
      user={user}
      onUpdateUser={async (payload) => {
        if (!userId) {
          console.error(
            "Cannot update: User ID is missing from user object:",
            user
          );
          return;
        }

        await updateUserMutation.mutateAsync(payload);
      }}
    />
  );
};
