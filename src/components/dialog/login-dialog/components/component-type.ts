import { AuthResponse, OtpVerificationData } from "@/auth";
import { AuthStep } from "../LoginDrawer";
import { UserAuthStep } from "@/types/auth.types";

export interface DrawerState {
  phoneNumber: string;
  countryCode: string;
  otpId?: string;
}

export interface MutationState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: Error | null;
  reset: () => void;
}

export interface ResendOTPResponse {
  success: boolean;
  data?: {
    otpId: string;
  };
}

export interface ForgotPasswordStepProps {
  setPasswordMutation: any;
  setPassword: ({
    tempToken,
    password,
    confirmPassword,
  }: {
    tempToken: string;
    password: string;
    confirmPassword: string;
  }) => Promise<AuthResponse>;
  verifyOTP: ({
    userId,
    otpId,
    otp,
  }: OtpVerificationData) => Promise<AuthResponse>;
  currentStep: AuthStep;
  resendOTP: any;
  userAuthStep: UserAuthStep;
  // resendOTP: (
  //   phoneNumber: string,
  //   countryCode: string
  // ) => Promise<ResendOTPResponse>;
  setStep: React.Dispatch<React.SetStateAction<AuthStep>>;
  setStatus: (status: "idle" | "loading" | "success" | "error") => void;
  setStatusMessage: (message: string) => void;
  drawerState: any;
  isCurrentlyLoading: boolean;
  sendPasswordResetCodeViaWhatsApp: (params: {
    phoneNumber: string;
    countryCode: string;
  }) => Promise<AuthResponse>;
  mutationSatate: any; // Note: You have a typo - should be "mutationState"
  clearError: () => void;
  handleVerifyOTP?: (otp: string) => void;
  setDrawerState: any;
  // setDrawerState: React.Dispatch<React.SetStateAction<DrawerState>>;
}
