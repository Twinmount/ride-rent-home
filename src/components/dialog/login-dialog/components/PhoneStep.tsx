"use client";

import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  useTransition,
  useMemo,
  memo,
} from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Loader2, UserCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import "../phone-input.css";
import { getDotCount, getNumberAfterSpaceStrict } from "@/utils/helper";
import { LoginDrawerState } from "../LoginDrawer";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import { useAuthContext } from "@/auth";
import { useOAuth } from "@/hooks/useOAuth";

// Memoized PhoneInput to prevent unnecessary re-renders
const InternalMemoizedPhoneInput = memo(
  function InternalMemoizedPhoneInputComponent({
    // <--- Give it a name here
    defaultCountry,
    value,
    onChange,
  }: {
    defaultCountry: string;
    value: string;
    onChange?: (value: any, country: any) => void;
  }) {
    return (
      <PhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        className="flex items-center justify-center"
        inputClassName="hidden"
        countrySelectorStyleProps={{
          className:
            "bg-transparent !text-xs !p-0 !bg-transparent !shadow-none cursor-pointer hover:opacity-80",
          style: {
            padding: 0,
            backgroundColor: "transparent",
            background: "transparent",
            boxShadow: "none",
          },
          buttonClassName:
            "!border-none outline-none !h-full !w-full !rounded-none bg-transparent !p-0 !bg-transparent !shadow-none cursor-pointer hover:opacity-80 transition-opacity",
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if country or value actually changed
    return (
      prevProps.defaultCountry === nextProps.defaultCountry &&
      prevProps.value === nextProps.value
    );
  }
);

// Then use it:
const MemoizedPhoneInput = InternalMemoizedPhoneInput;

export const PhoneStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setUserExists,
  isCurrentlyLoading,
  signup,
  checkUserExists,
  clearError,
  setDrawerState,
}: any) => {
  const { auth } = useAuthContext();
  const {
    signInWithProvider,
    isLoading: isOAuthLoading,
    session: oauthSession,
  } = useOAuth();
  const searchParams = useSearchParams();

  // Get showSocial query parameter - safely handle SSR
  const [showSocial, setShowSocial] = useState(false);

  useEffect(() => {
    // Only check searchParams on client side
    if (typeof window !== "undefined") {
      const showSocialParam = searchParams.get("showSocial") === "true";
      setShowSocial(showSocialParam);
    }
  }, [searchParams]);

  // Initialize detectedCountry from sessionStorage synchronously (if available)
  const getInitialCountry = (): string => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("detectedCountry");
      return stored || "";
    }
    return "";
  };

  // Location state - initialize from sessionStorage if available
  const [detectedCountry, setDetectedCountry] =
    useState<string>(getInitialCountry());

  const [userSelectedCountry, setUserSelectedCountry] = useState<string | null>(
    null
  );

  // Only fetch location if user is not logged in and we don't have a detected country
  // Use useMemo to prevent unnecessary recalculations and ensure stable reference
  const shouldFetchLocation = useMemo(
    () => !auth.isLoggedIn && !detectedCountry && !userSelectedCountry,
    [auth.isLoggedIn, detectedCountry, userSelectedCountry]
  );

  const {
    location,
    isLoading: isLocationLoading,
    dialCode: detectedDialCode,
  } = useLocationDetection(shouldFetchLocation);

  // useTransition for non-urgent state updates
  const [isPending, startTransition] = useTransition();

  // Phone state
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [allowNumberCount, setAllowNumberCount] = useState(0);

  const [showSkipOption, setShowSkipOption] = useState<boolean>(false);

  useEffect(() => {
    if (isLocationLoading) {
      const timer = setTimeout(() => {
        setShowSkipOption(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSkipOption(false);
      return undefined;
    }
  }, [isLocationLoading]);

  // Update detected country when location is detected
  // This effect captures the location before shouldFetchLocation becomes false
  useEffect(() => {
    if (
      location &&
      !isLocationLoading &&
      !userSelectedCountry &&
      !detectedCountry
    ) {
      const country = location.country;
      if (country) {
        setDetectedCountry(country);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("detectedCountry", country);
        }
      }
    }
  }, [location, userSelectedCountry, isLocationLoading, detectedCountry]);

  // Initialize country code when location is detected or country is loaded from storage
  useEffect(() => {
    if (detectedDialCode && !countryCode && !userSelectedCountry) {
      // Initialize country code from detected location
      startTransition(() => {
        setCountryCode(detectedDialCode);
      });
    }
  }, [detectedDialCode, countryCode, userSelectedCountry]);

  // Ensure PhoneInput initializes country code when country changes
  // This effect triggers when detectedCountry changes and we have a country but no code yet
  useEffect(() => {
    if (
      detectedCountry &&
      !countryCode &&
      !userSelectedCountry &&
      !detectedDialCode
    ) {
      // If we have a country from storage but no dial code,
      // PhoneInput should initialize it via onChange when it mounts
      // Set a small value to trigger PhoneInput initialization
      if (!phoneValue && detectedCountry) {
        // Setting an empty string will make PhoneInput initialize with defaultCountry
        setPhoneValue("");
      }
    }
  }, [
    detectedCountry,
    countryCode,
    userSelectedCountry,
    detectedDialCode,
    phoneValue,
  ]);

  const handleSkipDetection = () => {
    const defaultCountry = "ae";
    const defaultDialCode = "+971"; // UAE dial code
    setUserSelectedCountry(defaultCountry);
    setDetectedCountry(defaultCountry);
    setCountryCode(defaultDialCode);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("detectedCountry", defaultCountry);
    }
  };

  // Handle country code change with transition
  const onChangeCountryCode = useCallback(
    (value: any, country: any) => {
      const phoneDetails = getNumberAfterSpaceStrict(country.inputValue);
      const newAllowCount = getDotCount(country.country.format);
      const newCountryCode = `+${country.country.dialCode}`;
      const newCountry = country.country.iso2.toLowerCase();

      // Update display value immediately (urgent update)
      setPhoneValue(value);

      // Mark these updates as non-urgent
      startTransition(() => {
        setCountryCode(newCountryCode);
        setAllowNumberCount(newAllowCount);

        // Track user selection - user manually changed country
        if (newCountry !== detectedCountry) {
          setUserSelectedCountry(newCountry);
          setDetectedCountry(newCountry);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("detectedCountry", newCountry);
          }
        }

        if (
          newAllowCount === 0 ||
          phoneDetails.phoneNumber.length <= newAllowCount
        ) {
          setPhoneNumber(phoneDetails.phoneNumber);
        }
      });
    },
    [detectedCountry]
  );

  // Handle phone number input with transition
  const onHandlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      // Only allow numeric characters
      value = value.replace(/[^0-9]/g, "");

      // value = value.slice(0, allowNumberCount);
      value = allowNumberCount > 0 ? value.slice(0, allowNumberCount) : value;

      e.target.value = value;

      // startTransition(() => {
      setPhoneNumber(value);
      // });
    },
    [allowNumberCount]
  );

  const handlePhoneSubmit = async () => {
    setStatus("loading");
    setStatusMessage("Checking phone number...");
    clearError();

    try {
      const cleanedPhoneNumber = phoneNumber.replace(/[-\s()]/g, "");

      setDrawerState((draft: LoginDrawerState) => {
        draft.phoneNumber = cleanedPhoneNumber;
        draft.countryCode = countryCode;
      });

      const userExistsResponse = await checkUserExists(
        cleanedPhoneNumber,
        countryCode
      );

      if (userExistsResponse.success && userExistsResponse.data) {
        const userData = userExistsResponse.data;

        if (userData.userExists) {
          if (
            userData.isTempVerified === "TRUE" &&
            userData?.isProfileNavigationRequired
          ) {
            setDrawerState((prev: any) => ({
              ...prev,
              tempToken: userExistsResponse.data.tempToken,
            }));
            setUserExists(true);
            setStep("register");
            setStatus("success");
            setStatusMessage(
              "Welcome back! Please complete your registration."
            );
          } else if (userData.isPhoneVerified) {
            setUserExists(true);
            setStep("password");
            setStatus("success");
            setStatusMessage("Welcome back! Please enter your password.");
          } else {
            setStatus("loading");
            setStatusMessage(
              "Account found but not verified. Sending verification code..."
            );

            const signupResponse = await signup({
              phoneNumber: cleanedPhoneNumber,
              countryCode: countryCode,
              countryId: "",
            });

            if (signupResponse.success && signupResponse.data) {
              setUserExists(false);
              setStep("otp");
              setStatus("success");
              setStatusMessage("OTP sent successfully! Check your WhatsApp.");
            }
          }
        } else {
          if (userData.expiredTempUser) {
            setStatus("loading");
            setStatusMessage(
              "Previous session expired. Creating new account..."
            );
          } else {
            setStatus("loading");
            setStatusMessage("New user detected! Sending verification code...");
          }

          const signupResponse = await signup({
            phoneNumber: cleanedPhoneNumber,
            countryCode: countryCode,
            countryId: "",
          });

          if (signupResponse.success && signupResponse.data) {
            setUserExists(false);
            setStep("otp");
            setStatus("success");
            const message = userData.expiredTempUser
              ? "New verification code sent! Previous session was expired."
              : "OTP sent successfully! Check your WhatsApp.";
            setStatusMessage(message);
          }
        }
      } else {
        setStatus("error");
        setStatusMessage("Unable to verify phone number. Please try again.");
      }
    } catch (error: any) {
      console.log("error: [phone submit]", error);
      setStatus("error");
      setStatusMessage(
        error?.message || "Failed to verify phone number. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <UserCircle className="h-8 w-8 text-orange-600" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold">Welcome to Ride.Rent!</h3>
        <p className="text-balance text-muted-foreground">
          Enter your WhatsApp number to sign in or create a new account.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            {/* Show pending indicator if state updates are delayed */}
            {isPending && (
              <span className="text-xs text-muted-foreground">Updating...</span>
            )}
          </div>

          {isLocationLoading && showSkipOption && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                🔍 Still detecting location...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipDetection}
                className="h-auto p-1 text-xs text-orange-600 hover:text-orange-700"
              >
                Skip & use default
              </Button>
            </div>
          )}

          <div onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}>
            <div className="relative z-10 flex gap-2">
              <div
                className="flex h-10 w-20 flex-shrink-0 items-center justify-center rounded-lg border-2 bg-transparent backdrop-blur-sm transition-all hover:border-orange-300"
                title="Click to change country"
                role="button"
                aria-label="Country code selector"
              >
                <MemoizedPhoneInput
                  key={detectedCountry || userSelectedCountry || "ae"}
                  defaultCountry={
                    detectedCountry || userSelectedCountry || "ae"
                  }
                  value={phoneValue}
                  onChange={onChangeCountryCode}
                />
                <span className="mx-0.5 text-xs font-semibold">
                  {countryCode ||
                    (detectedDialCode && !userSelectedCountry
                      ? detectedDialCode
                      : "")}
                </span>
              </div>
              <input
                type="tel"
                id="phone"
                placeholder="enter phone number"
                value={phoneNumber}
                onChange={onHandlePhoneNumberChange}
                className="h-10 w-full flex-1 rounded-lg border-2 bg-transparent px-3 text-sm outline-none backdrop-blur-sm transition-all placeholder:text-black/40"
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
          </div>
          <p id="phone-help" className="sr-only">
            Enter your phone number to sign in or create an account
          </p>
        </div>
        <Button
          onClick={handlePhoneSubmit}
          disabled={!phoneNumber || isCurrentlyLoading || isLocationLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Checking...
            </>
          ) : isLocationLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting location...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
      {/* {showSocial && ( */}
      <>
        <div className="relative mb-6 flex items-center justify-center">
          <div className="h-px w-full bg-slate-300"></div>
          <span className="absolute rounded-sm bg-white px-3 text-sm text-slate-500">
            or
          </span>
        </div>
        <div
          className="mt-10 flex flex-col items-center justify-center gap-3"
          style={{ marginTop: "30px" }}
        >
          <Button
            onClick={() => signInWithProvider("google", { usePopup: true })}
            disabled={isOAuthLoading || isCurrentlyLoading}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Continue with Google"
          >
            <img
              src="/assets/icons/social-login/google-icon.png"
              alt="Google icon"
              className="h-5 w-5"
            />
            <span className="text-sm font-medium text-slate-700">
              Continue with Google
            </span>
          </Button>
          {showSocial && (
            <Button
              onClick={() => signInWithProvider("facebook", { usePopup: true })}
              disabled={isOAuthLoading || isCurrentlyLoading}
              className="flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Continue with Facebook"
            >
              <img
                src="/assets/icons/social-login/facebook-icon.png"
                alt="Facebook icon"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-slate-700">
                Continue with Facebook
              </span>
            </Button>
          )}
        </div>
      </>
      {/* )}  */}
    </div>
  );
};
