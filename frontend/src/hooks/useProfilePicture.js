import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api/apiClient";

export const useProfilePicture = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile-picture"],
    queryFn: async () => {
      const res = await apiClient.get("/upload/profile-picture");

      return res.data?.data?.profilePic || null;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      if (!file) {
        throw new Error("Please select an image file to upload");
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Only PNG, JPEG, JPG, and WEBP image files are allowed"
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image file must be smaller than 5MB");
      }

      const formData = new FormData();

      formData.append("image", file);

      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const res = await apiClient.post(
        "/upload/profile-picture",
        formData
      );

      return res.data;
    },

    onSuccess: (responseData) => {
      console.log("Profile picture uploaded successfully:", responseData);

      queryClient.invalidateQueries({
        queryKey: ["profile-picture"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
    },

    onError: (error) => {
      console.error(
        "Profile picture upload failed:",
        error?.response?.data || error
      );
    },
  });

  return {
    profilePic: profileQuery.data,
    isLoading: profileQuery.isLoading,
    uploadPicture: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
};