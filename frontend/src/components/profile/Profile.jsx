import { useState } from "react";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { Camera, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfilePicture = () => {
  const { profilePic, uploadPicture, isUploading } = useProfilePicture();
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg("");
      await uploadPicture(file);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to upload image");
    }
  };

  return (
    <Card className="max-w-xl mx-auto border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Profile Picture</CardTitle>
        <CardDescription>
          Upload a new profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMsg && (
          <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded border border-rose-200 dark:border-rose-800">
            {errorMsg}
          </p>
        )}

        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-indigo-100 dark:border-indigo-900 shadow-sm">
              <AvatarImage src={profilePic} alt="Profile" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xl">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="profile-picture-input"
              className={`absolute bottom-0 right-0 p-2 rounded-full text-white cursor-pointer shadow-md transition-colors ${
                isUploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                disabled={isUploading}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Click camera icon to change</p>
            <p className="text-xs text-muted-foreground">
              Supports JPEG, PNG, WEBP files up to 5MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};