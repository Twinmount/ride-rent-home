"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SafeImage from "@/components/common/SafeImage";

import { useAuth } from "@/hooks/useAuth";

// Step Components
import { PhoneStep } from "./components/PhoneStep";
import { PasswordStep } from "./components/PasswordStep";
import { OtpStep } from "./components/OtpStep";
import { RegisterStep } from "./components/RegisterStep";
import { SuccessStep } from "./components/SuccessStep";
import { useImmer } from "use-immer";
import { useAuthContext } from "@/auth";

export type AuthStep = "phone" | "password" | "otp" | "register" | "success";
export type StatusType = "idle" | "loading" | "success" | "error";

export interface LoginDrawerState {
  otp?: string;
  password?: string;
  phoneNumber?: string;
  countryCode?: string;
}

export interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialDrawerState: LoginDrawerState = {
  phoneNumber: "",
  countryCode: "",
  otp: "",
  password: "",
};

export const LoginDrawer: React.FC<LoginDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    signup,
    login,
    verifyOTP,
    setPassword,
    resendOTP,
    updateProfile,
    checkUserExists,
    isLoading: authLoading,
    error: authError,
    clearError,
    userAuthStep,
    logoutMutation,
    loginMutation,
  } = useAuthContext();

  useEffect(() => {
    if (logoutMutation.isSuccess) {
      setStep("phone");
      setStatus("idle");
      setStatusMessage("");
      setUserExists(false);
      setDrawerState(initialDrawerState);
      clearError();
    }
  }, [logoutMutation.isSuccess]);

  useEffect(() => {
    if (loginMutation.isSuccess) {
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  }, [loginMutation.isSuccess]);

  // Common State
  const [step, setStep] = useState<AuthStep>("phone");
  const [status, setStatus] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [userExists, setUserExists] = useState<boolean>(false);

  // All other states
  const [drawerState, setDrawerState] = useImmer<LoginDrawerState>({
    phoneNumber: "",
    countryCode: "",
    password: "",
    otp: "",
  });

  const resetState = () => {
    setStep("phone");
    setStatus("idle");
    setStatusMessage("");
    setUserExists(false);
    setDrawerState(initialDrawerState);
    clearError();
  };

  useEffect(() => {
    if (authError) {
      setStatus("error");
      setStatusMessage(authError.message);
    }
  }, [authError]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Status Icon
  const getStatusIcon = () => {
    const isLoading = status === "loading" || authLoading;
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return authLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null;
    }
  };

  const isCurrentlyLoading = status === "loading" || authLoading;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={handleClose}
        role="button"
        tabIndex={-1}
        aria-label="Close login drawer"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex h-full flex-col">
          <div
            className="p-6 text-white"
            style={{
              background:
                "linear-gradient(255.26deg, #f9a825 29.45%, #f57f17 88.69%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SafeImage
                  src="/assets/logo/Logo_Black.svg"
                  alt="Ride.Rent Logo"
                  width={70}
                  height={48}
                  className="w-[135px] brightness-0 invert"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close login drawer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-b border-border bg-orange-50/50 px-6 py-4">
            <div className="flex min-h-[20px] items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
                  status === "success" && "text-green-600",
                  status === "error" && "text-red-600",
                  isCurrentlyLoading && "text-orange-600",
                  status === "idle" && "text-muted-foreground"
                )}
                role="status"
                aria-live="polite"
              >
                {statusMessage || "Create Account/Login to continue"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {step === "phone" && (
              <PhoneStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                isCurrentlyLoading={isCurrentlyLoading}
                signup={signup}
                checkUserExists={checkUserExists}
                clearError={clearError}
                setDrawerState={setDrawerState}
              />
            )}
            {step === "password" && (
              <PasswordStep
                userAuthStep={userAuthStep}
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                login={login}
                clearError={clearError}
              />
            )}
            {step === "otp" && (
              <OtpStep
                userAuthStep={userAuthStep}
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                verifyOTP={verifyOTP}
                resendOTP={resendOTP}
                clearError={clearError}
              />
            )}
            {step === "register" && (
              <RegisterStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                setPassword={setPassword}
                updateProfile={updateProfile}
                clearError={clearError}
              />
            )}
            {step === "success" && <SuccessStep userExists={userExists} />}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <p className="text-balance text-center text-[11px] text-muted-foreground">
              By continuing, you agree to Ride.Rent&apos;s{" "}
              <a
                href="https://ride.rent/terms-condition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline hover:text-orange-700"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://ride.rent/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline hover:text-orange-700"
              >
                Privacy Policy
              </a>
              . Standard message and data rates may apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
