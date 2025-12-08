"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { useImmer } from "use-immer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import type {
  LoginData,
  PhoneSignupData,
  User,
  AuthResponse,
  AuthError,
  AuthState,
  InternalAuthState,
  SetPasswordData,
  ProfileUpdateData,
  PhoneChangeData,
  PhoneChangeVerificationData,
  ForgotPasswordData,
  OtpType,
  OtpVerificationData,
  DeleteUserData,
  AuthStep,
} from "@/types/auth.types";

// Import constants
import { STORAGE_KEYS, ERROR_MESSAGES } from "@/constants/auth.constants";

// Import utilities
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  createAuthError,
} from "@/utils/auth.utils";

// Import auth API service
import { authAPI } from "@/lib/api/auth.api";
import { authStorage } from "@/lib/auth/authStorage";
import {
  setToken,
  clearToken,
  createAuthenticatedRequest,
} from "@/lib/api/axios.config";
import { useStateAndCategory } from "./useStateAndCategory";

// Remove the old API_BASE_URL and AUTH_ENDPOINTS since they're now in the auth.api.ts file

// Main authentication hook
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { country, state: stateData } = useStateAndCategory();
  const { data: session, status, update: updateSession } = useSession();

  const [state, updateState] = useImmer<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!authStorage.getToken(),
    user: authStorage.getUser(),
  });

  const [auth, setAuth] = useImmer<InternalAuthState>({
    isLoggedIn: !!authStorage.getToken(),
    user: authStorage.getUser(),
    token: authStorage.getToken(),
    refreshToken: authStorage.getRefreshToken(),
  });

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [hasUserSaved, setHasUserSaved] = useState(false);
  // Use ref to track if modal was explicitly opened (e.g., after logout)
  // This prevents the useEffect from closing it when session status changes
  const wasExplicitlyOpened = useRef(false);
  const [step, setStep] = useState<AuthStep>("phone");
  const [showOAuthPhoneModal, setShowOAuthPhoneModal] = useState(false);

  const [userAuthStep, setUserAuthStep] = useImmer({
    userId: "",
    otpId: "",
    name: "",
    otpExpiresIn: 5,
  });

  useEffect(() => {
    if (status === "authenticated" && session) {
      const accessToken = (session as any)?.accessToken || null;
      setToken(accessToken);

      const isOAuthUser =
        session.provider && session.provider !== "credentials";
      const needsPhoneNumber =
        isOAuthUser && (!session.isPhoneVerified || !session.user?.phoneNumber);
    } else if (status === "unauthenticated") {
      //  Clear state
      //  updateState((draft) => {
      //    draft.isAuthenticated = false;
      //    draft.user = null;
      //    draft.isLoading = false;
      //  });
      //  authStorage.clear();
      // Don't automatically open login modal on unauthenticated status
      // Let the UI components control when to open it (e.g., after logout)
      // If modal was explicitly opened (e.g., after logout), keep it open
      if (wasExplicitlyOpened.current && !isLoginOpen) {
        setLoginOpen(true);
      }
      clearToken();
    }
    if ((session as any)?.error === "RefreshAccessTokenError") {
      signOut({ redirect: false });
      clearAuthData();
      clearToken();
    }

    // Cleanup on unmount to prevent memory leaks
    return () => {
      clearToken();
    };
  }, [session, status, updateState, setAuth]);

  // React Query Mutations
  const checkUserExistsMutation = useMutation({
    mutationFn: ({
      phoneNumber,
      countryCode,
    }: {
      phoneNumber: string;
      countryCode: string;
    }) => authAPI.checkUserExists(phoneNumber, countryCode),
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUserAuthStep((draft) => {
          draft.name = data?.data?.name || "";
        });
      }
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
      // Store user ID and OTP ID for OTP verification
      if (data.success && data.data) {
        setUserAuthStep((draft) => {
          draft.userId = data.data?.userId || "";
          draft.otpId = data.data?.otpId || "";
          draft.otpExpiresIn = data.data?.otpExpiresIn || 5;
        });
      }

      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success) {
        const user: User = {
          id: data?.data?.userId!,
          name: data?.data?.name!,
          avatar: data?.data?.avatar!,
          email: data?.data?.email!,
          phoneNumber: data?.data?.phoneNumber!,
          countryCode: data?.data?.countryCode!,
          isEmailVerified: data?.data?.isEmailVerified!,
          isPhoneVerified: data?.data?.isPhoneVerified!,
        };

        setAuthenticated(
          user,
          data.accessToken,
          data.refreshToken,
          true // Remember user
        );

        setAuth((draft) => {
          draft.isLoggedIn = true;
          draft.user = user;
          draft.token = data?.accessToken!;
          draft.refreshToken = data?.refreshToken!;
        });
        // Note: Login drawer will close automatically when NextAuth session updates
        setError(null);
      }
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authAPI.verifyOtp,
    onSuccess: (data) => {
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: authAPI.setPassword,
    onSuccess: async (data, variables) => {
      if (data.success && data.data) {
        // Sign in with NextAuth using credentials to create a session
        // NextAuth will handle token storage and session management through its flow:
        // 1. authorize() calls authAPI.login() which returns tokens
        // 2. JWT callback stores tokens in NextAuth token
        // 3. Session callback makes tokens available in session
        // 4. useEffect in useAuth will pick up session and call setToken() for axios
        try {
          const signInResult = await signIn("credentials", {
            phoneNumber: data.data.phoneNumber,
            countryCode: data.data.countryCode,
            password: variables.password, // Use the password that was just set
            redirect: false, // Prevent page reload
          });

          if (signInResult?.error) {
            console.error(
              "NextAuth sign in failed after password set:",
              signInResult.error
            );
            setError({ message: signInResult.error });
            return;
          }

          // Invalidate session query to refresh UI with new session
          await queryClient.invalidateQueries({ queryKey: ["session"] });
        } catch (signInError) {
          console.error(
            "Error signing in with NextAuth after password set:",
            signInError
          );
          setError({
            message:
              signInError instanceof Error
                ? signInError.message
                : "Failed to create session",
          });
          return;
        }
      }
      setLoginOpen(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authAPI.resendOtp,
    onSuccess: (data) => {
      setError(null);
      setUserAuthStep((draft) => {
        draft.userId = data.data?.userId || "";
        draft.otpId = data.data?.otpId || "";
      });
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: (data) => {
      setUserAuthStep((draft) => {
        draft.userId = data.data?.userId || "";
        draft.otpId = data.data?.otpId || "";
      });
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const updateUserNameAndAvatar = useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: ProfileUpdateData;
    }) => authAPI.updateProfile(userId, profileData),
    onSuccess: (data) => {
      setError(null);

      // Update user state with new name and avatar, preserving existing fields
      updateState((draft) => {
        if (draft.user) {
          // Only update name and avatar fields, keep all other user data
          if (data?.data?.name) {
            draft.user.name = data.data.name;
          }
          if (data?.data?.avatar) {
            draft.user.avatar = data.data.avatar;
          }
        }
      });

      // Update auth state as well
      setAuth((draft) => {
        if (draft.user) {
          // Only update name and avatar fields, keep all other user data
          if (data?.data?.name) {
            draft.user.name = data.data.name;
          }
          if (data?.data?.avatar) {
            draft.user.avatar = data.data.avatar;
          }
        }
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", session?.user?.id],
      });
    },
    onError: (error: Error) => {
      setError({ message: error.message });
      console.error("Profile update failed:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: ({ userId }: { userId?: string }) => authAPI.logout(userId),
    onSuccess: (data) => {
      setAuthenticated(null);
      setAuth((draft) => {
        draft.isLoggedIn = false;
        draft.user = null;
        draft.token = null;
        draft.refreshToken = null;
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile", session?.user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.warn("Logout request failed:", error);
      // Continue with logout even if server request fails
      setAuthenticated(null);
      setAuth((draft) => {
        draft.isLoggedIn = false;
        draft.user = null;
        draft.token = null;
        draft.refreshToken = null;
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (deleteUserData: DeleteUserData) =>
      authAPI.deleteUser(deleteUserData),
    onSuccess: async (data) => {
      router.push(`/${country}/${stateData}`);
      setLoginOpen(true);
      setStep("phone");
      setAuthenticated(null);

      await signOut({ redirect: false });

      clearToken();
      queryClient.clear();
    },
    onError: async (error) => {
      console.error("User deletion failed:", error);
      // Optionally handle cleanup even if delete fails
      setAuthenticated(null);
      setAuth((draft) => {
        draft.isLoggedIn = false;
        draft.user = null;
        draft.token = null;
        draft.refreshToken = null;
      });

      // Clear NextAuth session even on error
      await signOut({ redirect: false });
      clearToken(); // Clear axios token
    },
  });

  const requestPhoneChangeMutation = useMutation({
    mutationFn: ({
      newPhoneNumber,
      newCountryCode,
    }: {
      newPhoneNumber: string;
      newCountryCode: string;
    }) => authAPI.requestPhoneNumberChange(newPhoneNumber, newCountryCode),
    onSuccess: (data) => {
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const verifyPhoneChangeMutation = useMutation({
    mutationFn: ({
      otpId,
      otp,
      newPhoneNumber,
      newCountryCode,
    }: {
      otpId: string;
      otp: string;
      newPhoneNumber: string;
      newCountryCode: string;
    }) =>
      authAPI.verifyPhoneNumberChange(
        otpId,
        otp,
        newPhoneNumber,
        newCountryCode
      ),
    onSuccess: async (data) => {
      setError(null);

      // Update NextAuth session with new phone number and verification status
      try {
        await updateSession({
          user: {
            phoneNumber:
              data.data?.phoneNumber || session?.user?.phoneNumber || undefined,
            countryCode:
              data.data?.countryCode || session?.user?.countryCode || undefined,
          },
          isPhoneVerified: data.data?.isPhoneVerified,
        });
      } catch (updateError) {
        console.error(
          "Failed to update NextAuth session after phone number change:",
          updateError
        );
        // Continue with local state updates even if session update fails
      }

      // Update user state with new phone number and verification status
      updateState((draft) => {
        if (draft.user && data?.data) {
          if (data.data.phoneNumber) {
            draft.user.phoneNumber = data.data.phoneNumber;
          }
          if (data.data.countryCode) {
            draft.user.countryCode = data.data.countryCode;
          }
          if (data.data.isPhoneVerified !== undefined) {
            draft.user.isPhoneVerified = data.data.isPhoneVerified;
          }
        }
      });

      // Update auth state as well
      setAuth((draft) => {
        if (draft.user && data?.data) {
          if (data.data.phoneNumber) {
            draft.user.phoneNumber = data.data.phoneNumber;
          }
          if (data.data.countryCode) {
            draft.user.countryCode = data.data.countryCode;
          }
          if (data.data.isPhoneVerified !== undefined) {
            draft.user.isPhoneVerified = data.data.isPhoneVerified;
          }
        }
      });

      // Update storage with the updated user object
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...(data?.data?.phoneNumber && {
            phoneNumber: data.data.phoneNumber,
          }),
          ...(data?.data?.countryCode && {
            countryCode: data.data.countryCode,
          }),
          ...(data?.data?.isPhoneVerified !== undefined && {
            isPhoneVerified: data.data.isPhoneVerified,
          }),
        };
        authStorage.setUser(updatedUser, true); // Save to localStorage
      }

      // Invalidate React Query cache to refresh any queries that depend on user data
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  // OAuth Phone Linking Mutations
  const addOAuthPhoneMutation = useMutation({
    mutationFn: ({
      userId,
      phoneNumber,
      countryCode,
    }: {
      userId: string;
      phoneNumber: string;
      countryCode: string;
    }) => authAPI.addPhoneToOAuthUser(userId, phoneNumber, countryCode),
    onSuccess: (data, variables) => {
      if (data.success && data.data) {
        setUserAuthStep((draft) => {
          draft.userId = data.data?.userId || variables.userId;
          draft.otpId = data.data?.otpId || "";
          draft.otpExpiresIn = data.data?.otpExpiresIn || 5;
        });
      }
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const verifyOAuthPhoneMutation = useMutation({
    mutationFn: async ({
      userId,
      phoneNumber,
      countryCode,
      otpId,
      otp,
      provider,
      providerAccountId,
      accessToken,
    }: {
      userId: string;
      phoneNumber: string;
      countryCode: string;
      otpId?: string;
      otp?: string;
      provider?: string;
      providerAccountId?: string;
      accessToken?: string;
    }) => {
      try {
        const response = await createAuthenticatedRequest.auth.post(
          "/verify-oauth-phone",
          {
            userId,
            phoneNumber,
            countryCode,
            ...(otpId && { otpId }),
            ...(otp && { otp }),
            ...(provider && { provider }),
            ...(providerAccountId && { providerAccountId }),
            ...(accessToken && { accessToken }),
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to verify OAuth phone number"
        );
      }
    },
    onSuccess: async (data) => {
      if (data.success && data.data) {
        // Update token first if new tokens are provided
        if (data.accessToken) {
          setToken(data.accessToken);
        }

        // If account was linked, we need to update the session with new user ID and tokens
        if (data.data?.accountLinked && data.data?.userId) {
          // Account was linked to existing account - update Next-Auth session with new user ID and tokens
          // This triggers the JWT callback with trigger === "update"
          try {
            await updateSession({
              user: {
                id: data.data.userId,
                name: data.data.name || session?.user?.name || undefined,
                email: data.data.email || session?.user?.email || undefined,
                image: data.data.avatar || session?.user?.image || undefined,
                phoneNumber: data.data.phoneNumber || undefined,
                countryCode: data.data.countryCode || undefined,
              },
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              isPhoneVerified: data.data.isPhoneVerified,
              isEmailVerified: data.data.isEmailVerified,
              accountLinked: true, // Flag to indicate account linking
            });
          } catch (updateError) {
            console.error(
              "Failed to update Next-Auth session after account linking:",
              updateError
            );
            // Continue with local state updates even if session update fails
          }
        } else {
          // Account not linked, just update phone verification status
          // Update session to refresh phone verification status
          try {
            await updateSession({
              user: {
                phoneNumber:
                  data.data.phoneNumber ||
                  session?.user?.phoneNumber ||
                  undefined,
                countryCode:
                  data.data.countryCode ||
                  session?.user?.countryCode ||
                  undefined,
              },
              isPhoneVerified: data.data.isPhoneVerified,
            });
          } catch (updateError) {
            console.error(
              "Failed to update Next-Auth session after phone verification:",
              updateError
            );
          }
        }

        await queryClient.invalidateQueries({ queryKey: ["session"] });

        // Close modal on success
        setShowOAuthPhoneModal(false);
        setError(null);

        // If account was linked, show a message to the user
        if (data.data?.accountLinked) {
          console.log("OAuth account successfully linked to existing account");
        }
      }
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const requestEmailChangeMutation = useMutation({
    mutationFn: ({ newEmail }: { newEmail: string }) =>
      authAPI.requestEmailChange(newEmail),
    onSuccess: (data) => {
      setError(null);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const verifyEmailChangeMutation = useMutation({
    mutationFn: ({
      otpId,
      otp,
      newEmail,
    }: {
      otpId: string;
      otp: string;
      newEmail: string;
    }) => authAPI.verifyEmailChange(otpId, otp, newEmail),
    onSuccess: (data) => {
      setError(null);

      // Update user state with new email and verification status
      updateState((draft) => {
        if (draft.user && data?.data) {
          if (data.data.email) {
            draft.user.email = data.data.email;
          }
          if (data.data.isEmailVerified !== undefined) {
            draft.user.isEmailVerified = data.data.isEmailVerified;
          }
        }
      });

      // Update auth state as well
      setAuth((draft) => {
        if (draft.user && data?.data) {
          if (data.data.email) {
            draft.user.email = data.data.email;
          }
          if (data.data.isEmailVerified !== undefined) {
            draft.user.isEmailVerified = data.data.isEmailVerified;
          }
        }
      });

      // Update storage with the updated user object
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...(data?.data?.email && { email: data.data.email }),
          ...(data?.data?.isEmailVerified !== undefined && {
            isEmailVerified: data.data.isEmailVerified,
          }),
        };
        authStorage.setUser(updatedUser, true); // Save to localStorage
      }
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const clearAuthData = useCallback(() => {
    // Clear auth storage
    authStorage.clear();
    // Update all auth states
    updateState((draft) => {
      draft.isAuthenticated = false;
      draft.user = null;
      draft.error = null;
      draft.isLoading = false;
    });

    setAuth((draft) => {
      draft.isLoggedIn = false;
      draft.user = null;
      draft.token = null;
      draft.refreshToken = null;
    });
    // Clear React Query cache
    queryClient.clear();
    setUserAuthStep((draft) => {
      draft.userId = "";
      draft.otpId = "";
      draft.name = "";
      draft.otpExpiresIn = 5;
    });
  }, [updateState, setAuth, queryClient, setUserAuthStep]);

  // React Query for getUserProfile
  // Uses NextAuth session to determine if query should be enabled
  const useGetUserProfile = (userId: string, enabled: boolean = true) => {
    // Check if user is authenticated via NextAuth session
    const isAuthenticated = status === "authenticated" && !!session?.user?.id;

    return useQuery({
      queryKey: ["userProfile", userId],
      queryFn: () => authAPI.getUserProfile(userId),
      enabled: !!userId && enabled && isAuthenticated,
      // retry: 2,
      refetchOnWindowFocus: false,
    });
  };

  const onHandleLoginmodal = ({ isOpen }: { isOpen: boolean }) => {
    setLoginOpen(isOpen);
    // Track if modal was explicitly opened
    wasExplicitlyOpened.current = isOpen;
  };

  const handleProfileNavigation = () => {
    router.push("/user-profile");
  };

  const setLoading = useCallback(
    (loading: boolean) => {
      updateState((draft) => {
        draft.isLoading = loading;
      });
    },
    [updateState]
  );

  const setError = useCallback(
    (error: AuthError | null) => {
      updateState((draft) => {
        draft.error = error;
      });
    },
    [updateState]
  );

  const setAuthenticated = (
    user: User | null,
    token?: string,
    refreshToken?: string,
    rememberMe: boolean = false
  ) => {
    if (user && token) {
      authStorage.setToken(token, rememberMe);
      authStorage.setUser(user, rememberMe);
      if (refreshToken) {
        authStorage.setRefreshToken(refreshToken, rememberMe);
      }
      updateState((draft) => {
        draft.isAuthenticated = true;
        draft.user = user;
        draft.error = null;
      });
    } else {
      authStorage.clear();
      updateState((draft) => {
        draft.isAuthenticated = false;
        draft.user = null;
      });
    }
  };

  // Login function

  const login = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
      // Validate input
      // if (!validatePhoneNumber(loginData.phoneNumber)) {
      //   throw new Error(ERROR_MESSAGES.INVALID_PHONE);
      // }

      if (!loginData.password) {
        throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
      }

      // Use React Query mutation
      // return loginMutation.mutateAsync({
      //   phoneNumber: loginData.phoneNumber,
      //   countryCode: loginData.countryCode,
      //   password: loginData.password,
      // });

      // Trigger NextAuth Credentials Flow
      const result = await signIn("credentials", {
        phoneNumber: loginData.phoneNumber,
        countryCode: loginData.countryCode,
        password: loginData.password,
        redirect: false, // Prevents page reload
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      // Success is handled by the useEffect above detecting the new Session
      // We return a mock response to satisfy the interface if needed
      return { success: true } as AuthResponse;
    } catch (error) {
      const authError = createAuthError(
        error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED
      );
      setError(authError);
      throw authError;
    }
  };

  // Signup function
  const signup = async (signupData: PhoneSignupData): Promise<AuthResponse> => {
    try {
      if (!signupData.countryCode) {
        throw new Error(ERROR_MESSAGES.COUNTRY_CODE_REQUIRED);
      }
      // Use React Query mutation
      return signupMutation.mutateAsync({
        phoneNumber: signupData.phoneNumber,
        countryCode: signupData.countryCode,
        countryId: signupData.countryId,
      });
    } catch (error) {
      const authError = createAuthError(
        error instanceof Error ? error.message : ERROR_MESSAGES.SIGNUP_FAILED
      );
      setError(authError);
      throw authError;
    }
  };
  // Logout function
  const logout = async (id?: string): Promise<void> => {
    try {
      logoutMutation.mutateAsync({ userId: id });
      await signOut({ redirect: false });
      router.push(`/${country}/${stateData}`);
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      clearAuthData();
    }
  };

  const deleteUser = async (
    deleteUserData: DeleteUserData
  ): Promise<AuthResponse> => {
    try {
      return await deleteUserMutation.mutateAsync(deleteUserData);
    } catch (error) {
      const authError: AuthError = {
        message: "User deletion failed",
      };
      setError(authError);
      throw authError;
    }
  };

  // Verify OTP function
  const verifyOTP = async (
    otpVerificationData: OtpVerificationData
  ): Promise<AuthResponse> => {
    try {
      return verifyOtpMutation.mutateAsync(otpVerificationData);
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error ? error.message : "OTP verification failed",
      };
      setError(authError);
      throw authError;
    }
  };

  // Set Password function
  const setPassword = async (
    passwordData: SetPasswordData
  ): Promise<AuthResponse> => {
    try {
      const passwordValidation = validatePassword(passwordData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      if (passwordData.password !== passwordData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      return setPasswordMutation.mutateAsync(passwordData);
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error ? error.message : "Failed to set password",
      };
      setError(authError);
      throw authError;
    }
  };

  // forgot password
  const forgotPassword = async (
    passwordData: ForgotPasswordData
  ): Promise<AuthResponse> => {
    try {
      return forgotPasswordMutation.mutateAsync(passwordData);
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error ? error.message : "Failed to set password",
      };
      setError(authError);
      throw authError;
    }
  };

  // Resend OTP function
  const resendOTP = useCallback(
    async (
      phoneNumber: string,
      countryCode: string,
      otpType?: OtpType
    ): Promise<AuthResponse> => {
      try {
        return resendOtpMutation.mutateAsync({
          phoneNumber,
          countryCode,
          otpType: otpType,
        });
      } catch (error) {
        const authError: AuthError = {
          message:
            error instanceof Error ? error.message : "Failed to resend OTP",
        };
        setError(authError);
        throw authError;
      }
    },
    [resendOtpMutation]
  );

  // Update Profile function
  const updateProfile = async (
    userId: string,
    profileData: ProfileUpdateData
  ): Promise<AuthResponse> => {
    try {
      return updateUserNameAndAvatar.mutateAsync({
        userId,
        profileData,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error ? error.message : "Failed to update profile",
      };
      setError(authError);
      throw authError;
    }
  };

  // Request phone number change function
  const requestPhoneNumberChange = async (
    newPhoneNumber: string,
    newCountryCode: string
  ): Promise<AuthResponse> => {
    try {
      return requestPhoneChangeMutation.mutateAsync({
        newPhoneNumber,
        newCountryCode,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to request phone number change",
      };
      setError(authError);
      throw authError;
    }
  };

  // Verify phone number change function
  const verifyPhoneNumberChange = async (
    otpId: string,
    otp: string,
    newPhoneNumber: string,
    newCountryCode: string
  ): Promise<AuthResponse> => {
    try {
      return verifyPhoneChangeMutation.mutateAsync({
        otpId,
        otp,
        newPhoneNumber,
        newCountryCode,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to verify phone number change",
      };
      setError(authError);
      throw authError;
    }
  };

  // Request email change function
  const requestEmailChange = async (
    newEmail: string
  ): Promise<AuthResponse> => {
    try {
      return requestEmailChangeMutation.mutateAsync({ newEmail });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to request email address change",
      };
      setError(authError);
      throw authError;
    }
  };

  // Verify email change function
  const verifyEmailChange = async (
    otpId: string,
    otp: string,
    newEmail: string
  ): Promise<AuthResponse> => {
    try {
      return verifyEmailChangeMutation.mutateAsync({
        otpId,
        otp,
        newEmail,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to verify email address change",
      };
      // setError(authError);
      throw authError;
    }
  };

  // Check if user exists function
  const checkUserExists = async (
    phoneNumber: string,
    countryCode: string
  ): Promise<AuthResponse> => {
    try {
      return checkUserExistsMutation.mutateAsync({
        phoneNumber,
        countryCode,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to check user existence",
      };
      setError(authError);
      throw authError;
    }
  };

  // Add phone number to OAuth user function
  const addOAuthPhone = async (
    userId: string,
    phoneNumber: string,
    countryCode: string
  ): Promise<AuthResponse> => {
    try {
      return addOAuthPhoneMutation.mutateAsync({
        userId,
        phoneNumber,
        countryCode,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error ? error.message : "Failed to add phone number",
      };
      setError(authError);
      throw authError;
    }
  };

  // Verify OAuth phone number function (OTP is optional - can skip verification)
  const verifyOAuthPhone = async (
    userId: string,
    phoneNumber: string,
    countryCode: string,
    otpId?: string,
    otp?: string
  ): Promise<AuthResponse> => {
    try {
      // Get OAuth provider information from session if available
      const provider = session?.provider;
      const providerAccountId = session?.providerAccountId;
      // Note: accessToken is not stored in session for security, but we can get it from the OAuth user's data if needed
      // For now, we'll let the backend extract it from the OAuth user record

      return verifyOAuthPhoneMutation.mutateAsync({
        userId,
        phoneNumber,
        countryCode,
        otpId,
        otp,
        provider,
        providerAccountId,
      });
    } catch (error) {
      const authError: AuthError = {
        message:
          error instanceof Error
            ? error.message
            : "Failed to verify phone number",
      };
      setError(authError);
      throw authError;
    }
  };

  const formatMemberSince = (createdAt: string): string => {
    if (!createdAt) return "Member since -"; // fallback if empty

    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return "Member since -"; // fallback if invalid date
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      timeZone: "UTC", // keep consistent formatting
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return `Member since ${formattedDate}`;
  };

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    auth,
    ...state,
    step,
    isLoginOpen,
    showOAuthPhoneModal,
    authStorage,
    userAuthStep,

    // Loading states from mutations
    isLoading:
      state.isLoading ||
      checkUserExistsMutation.isPending ||
      signupMutation.isPending ||
      loginMutation.isPending ||
      verifyOtpMutation.isPending ||
      setPasswordMutation.isPending ||
      resendOtpMutation.isPending ||
      updateUserNameAndAvatar.isPending ||
      logoutMutation.isPending ||
      requestPhoneChangeMutation.isPending ||
      verifyPhoneChangeMutation.isPending ||
      requestEmailChangeMutation.isPending ||
      verifyEmailChangeMutation.isPending ||
      addOAuthPhoneMutation.isPending ||
      verifyOAuthPhoneMutation.isPending,

    // Actions
    setStep,
    checkUserExists,
    login,
    signup,
    logout,
    verifyOTP,
    setPassword,
    forgotPassword,
    setHasUserSaved,
    resendOTP,
    deleteUser,
    updateProfile,
    requestPhoneNumberChange,
    verifyPhoneNumberChange,
    requestEmailChange,
    verifyEmailChange,
    addOAuthPhone,
    verifyOAuthPhone,
    setShowOAuthPhoneModal,
    clearError,
    onHandleLoginmodal,
    handleProfileNavigation,

    // Queries
    useGetUserProfile,

    // Mutation states for granular loading control
    hasUserSaved,
    checkUserExistsMutation,
    signupMutation,
    loginMutation,
    verifyOtpMutation,
    setPasswordMutation,
    forgotPasswordMutation,
    resendOtpMutation,
    updateUserNameAndAvatar,
    logoutMutation,
    deleteUserMutation,
    requestPhoneChangeMutation,
    verifyPhoneChangeMutation,
    requestEmailChangeMutation,
    verifyEmailChangeMutation,
    addOAuthPhoneMutation,
    verifyOAuthPhoneMutation,

    // Utilities
    clearAuthData,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    formatMemberSince,
  };
};
