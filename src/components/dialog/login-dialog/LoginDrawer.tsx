"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  // Auth hook
  const {
    checkUserExists,
    signup,
    login,
    verifyOTP,
    setPassword,
    resendOTP,
    updateProfile,
    isLoading: authLoading,
    error: authError,
    clearError,
    userAuthStep,
  } = useAuthContext();

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

  console.log("authError: ", authError);

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
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <span className="text-lg font-bold">🚗</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ride.Rent</h2>
                  <p className="text-xs text-white/80">
                    {step === "register" ? "Complete Profile" : "Sign In"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-b border-border bg-orange-50/50 px-6 py-4">
            <div className="flex min-h-[20px] items-center gap-2">
              {getStatusIcon()}
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  status === "success" && "text-green-600",
                  status === "error" && "text-red-600",
                  isCurrentlyLoading && "text-orange-600",
                  status === "idle" && "text-muted-foreground"
                )}
              >
                {statusMessage || "Enter your phone number to continue"}
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
            <p className="text-balance text-center text-xs text-muted-foreground">
              By continuing, you agree to Ride.Rent's Terms of Service and
              Privacy Policy. Standard message and data rates may apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
