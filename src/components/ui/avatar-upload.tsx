"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, X, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import Image from "next/image";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName?: string;
  userId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onUploadSuccess?: (avatarUrl: string) => void;
  onUploadError?: (error: string) => void;
}

interface NotificationState {
  message: string;
  type: "success" | "error" | null;
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar = "",
  userName = "User",
  userId,
  size = "lg",
  className = "",
  onUploadSuccess,
  onUploadError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: null,
  });

  const { uploadAvatar, isUploading, error, clearError } = useAvatarUpload({
    userId,
    onSuccess: (avatarUrl) => {
      showNotification("Avatar updated successfully!", "success");
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess?.(avatarUrl);
    },
    onError: (errorMessage) => {
      showNotification(errorMessage, "error");
      onUploadError?.(errorMessage);
    },
  });

  // Auto-hide notification after 3 seconds
  React.useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showNotification("Please select a file", "error");
      return;
    }

    try {
      await uploadAvatar(selectedFile);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Avatar upload failed:", error);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar = previewUrl || currentAvatar;
  const showUploadButtons = selectedFile && previewUrl;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Notification */}
      {notification.type && (
        <div
          className={`w-full max-w-sm rounded-lg p-3 text-sm font-medium ${
            notification.type === "success"
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Avatar Display */}
      <div className="group relative">
        <Avatar
          className={`${sizeClasses[size]} border-4 border-white shadow-lg`}
        >
          {displayAvatar && (
            <Image
              src={displayAvatar || ""}
              alt={`${userName}'s avatar`}
              fill
              className="object-cover"
              onError={() => {
                console.warn("Avatar image failed to load:", displayAvatar);
              }}
              referrerPolicy="no-referrer"
              unoptimized={displayAvatar?.includes("googleusercontent.com")}
            />
          )}
          {/* <AvatarImage
            src={displayAvatar || undefined}
            alt={`${userName}'s avatar`}
            className="object-cover"
          /> */}
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-lg font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Upload Overlay */}
        <div
          className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={triggerFileSelect}
        >
          <Camera className={`${iconSizes[size]} text-white`} />
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
            <Loader2 className={`${iconSizes[size]} animate-spin text-white`} />
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Buttons */}
      {!showUploadButtons ? (
        <Button
          onClick={triggerFileSelect}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {displayAvatar ? "Change Photo​" : "Choose Photo"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpload}
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}

      {/* File Info */}
    </div>
  );
};

export default AvatarUpload;
