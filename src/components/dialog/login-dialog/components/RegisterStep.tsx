import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, Eye, EyeOff, Loader2 } from "lucide-react";

export const RegisterStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setDrawerState,
  drawerState,
  isCurrentlyLoading,
  setPassword,
  updateProfile,
  clearError,
}: any) => {
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file for upload
      setProfileImageFile(file);

      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegistration = async () => {
    if (!fullName.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setStatusMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setStatus("error");
      setStatusMessage("Password must be at least 6 characters long.");
      return;
    }

    setStatus("loading");
    setStatusMessage("Creating your account...");
    clearError();

    try {
      const passwordResponse = await setPassword({
        tempToken: drawerState.tempToken,
        password: newPassword,
        confirmPassword: confirmPassword,
      });
      if (passwordResponse.success && passwordResponse.data?.userId) {
        if (fullName || profileImageFile) {
          const profileData: any = {};
          if (fullName) profileData.name = fullName;
          if (profileImageFile) profileData.avatar = profileImageFile; // Use the File object, not base64 string
          await updateProfile(passwordResponse.data.userId, profileData);
        }
        setStep("success");
        setStatus("success");
        setStatusMessage("Account created successfully!");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(
        error?.message || "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <User className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold">Complete Your Profile</h3>
        <p className="text-balance text-muted-foreground">
          Set up your account to start booking with Ride.Rent
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-orange-600" />
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-orange-200 bg-white p-0 hover:bg-orange-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 text-orange-600" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Optional</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isCurrentlyLoading}
            className="focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Create Password *
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isCurrentlyLoading}
              className="pr-10 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password *
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isCurrentlyLoading}
              className="pr-10 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleRegistration}
          disabled={
            !fullName.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim() ||
            isCurrentlyLoading
          }
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );
};
