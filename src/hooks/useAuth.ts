"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import { setToken, clearToken } from "@/lib/api/axios.config";

// Remove the old API_BASE_URL and AUTH_ENDPOINTS since they're now in the auth.api.ts file

// Main authentication hook
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
    // 1. HOOK INTO NEXTAUTH
    const { data: session, status } = useSession(); 

  const [state, updateState] = useImmer<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!authStorage.getToken(),
    user: authStorage.getUser(),
  });

  const [] = useImmer({});

  const [auth, setAuth] = useImmer<InternalAuthState>({
    isLoggedIn: !!authStorage.getToken(),
    user: authStorage.getUser(),
    token: authStorage.getToken(),
    refreshToken: authStorage.getRefreshToken(),
  });

  console.log("auth: [useAuth]", auth);

  const [isLoginOpen, setLoginOpen] = useImmer(false);
  const [step, setStep] = useState<AuthStep>("phone");


  const [userAuthStep, setUserAuthStep] = useImmer({
    userId: "",
    otpId: "",
    name: "",
    otpExpiresIn: 5,
  });


  useEffect(() => {
    if (status === "authenticated" && session) {  
      // Map NextAuth session user to your App's User type
      const mappedUser: User = {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
        // You might need to extend the NextAuth session type or fetch profile here
        // if these fields aren't in the session callback
        phoneNumber: session.user.phoneNumber || "",
        countryCode: session.user.countryCode || "",
        isPhoneVerified: session.isPhoneVerified || false, 
        isEmailVerified: session.isEmailVerified || false,
      };

      updateState((draft) => {
        draft.isAuthenticated = true;
        draft.user = mappedUser;
        draft.isLoading = false;
      });

      setAuth((draft) => {
        draft.isLoggedIn = true;
        draft.user = mappedUser;
        draft.token = (session as any).accessToken;
      });

      // Set token for axios interceptors (synchronous token access)
      // Pass only the token string, not a closure, to prevent memory leaks
      const accessToken = (session as any)?.accessToken || null;
      setToken(accessToken);
      
      // OPTIONAL: Keep storage in sync for legacy code, but DO NOT rely on it for Auth check
      // authStorage.setToken((session as any).accessToken, true); 
    } else if (status === "unauthenticated") {
       // Clear state
       updateState((draft) => {
         draft.isAuthenticated = false;
         draft.user = null;
         draft.isLoading = false;
       });
       authStorage.clear();
       // Clear token to prevent memory leaks
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

  // useEffect(() => {
  //   const handleLogoutEvent = (event: CustomEvent) => {
  //     // Clear auth storage (if not already cleared)
  //     authStorage.clear();

  //     // Update all auth states
  //     updateState((draft) => {
  //       draft.isAuthenticated = false;
  //       draft.user = null;
  //       draft.error = null;
  //     });

  //     setAuth((draft) => {
  //       draft.isLoggedIn = false;
  //       draft.user = null;
  //       draft.token = null;
  //       draft.refreshToken = null;
  //     });

  //     // Clear React Query cache
  //     queryClient.clear();

  //     // Close login modal if open
  //     // setLoginOpen(false);

  //     // Optionally redirect to home or login page
  //     // router.push("/");
  //   };

  //   // Add event listener
  //   window.addEventListener("auth:logout", handleLogoutEvent as EventListener);

  //   // Cleanup event listener
  //   return () => {
  //     window.removeEventListener(
  //       "auth:logout",
  //       handleLogoutEvent as EventListener
  //     );
  //   };
  // }, []);

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
        // setLoginOpen(false);
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
    onSuccess: (data) => {
      if (data.success && data.data) {
        const user: User = {
          id: data?.data?.userId!,
          phoneNumber: data?.data?.phoneNumber!,
          countryCode: data?.data?.countryCode!,
          email: data?.data?.email!,
          isEmailVerified: data?.data?.isEmailVerified!,
          isPhoneVerified: data?.data?.isPhoneVerified!,
          avatar: data.data.avatar,
          name: data.data.name,
        };

        setAuthenticated(
          user,
          data.accessToken,
          data.refreshToken,
          true 
        );

        setAuth((draft) => {
          draft.isLoggedIn = true;
          draft.user = user;
          draft.token = data?.accessToken!;
          draft.refreshToken = data?.refreshToken!;
        });
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

      // Update storage with the updated user object
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...(data?.data?.name && { name: data.data.name }),
          ...(data?.data?.avatar && { avatar: data.data.avatar }),
        };
        authStorage.setUser(updatedUser, true); // Save to localStorage
      }
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
    onSuccess: (data) => {
      setStep("phone");
      setAuthenticated(null);
      setAuth((draft) => {
        draft.isLoggedIn = false;
        draft.user = null;
        draft.token = null;
        draft.refreshToken = null;
      });

      queryClient.clear(); // Clear cached data
    },
    onError: (error) => {
      console.error("User deletion failed:", error);

      // Optionally handle cleanup even if delete fails
      setAuthenticated(null);
      setAuth((draft) => {
        draft.isLoggedIn = false;
        draft.user = null;
        draft.token = null;
        draft.refreshToken = null;
      });
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
    onSuccess: (data) => {
      setError(null);

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
  const useGetUserProfile = (userId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ["userProfile", userId],
      queryFn: () => authAPI.getUserProfile(userId),
      enabled: !!userId && enabled && !!authStorage.getToken(),
      // retry: 2,
      // refetchOnWindowFocus: false,
    });
  };

  const onHandleLoginmodal = ({ isOpen }: { isOpen: boolean }) => {
    setLoginOpen((draft) => {
      draft = isOpen;
      return draft;
    });
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
      // await logoutMutation.mutateAsync({ userId: id });
      // authStorage.clear();
      await signOut({ redirect: false });
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
      verifyEmailChangeMutation.isPending,

    // Actions
    setStep,
    checkUserExists,
    login,
    signup,
    logout,
    verifyOTP,
    setPassword,
    forgotPassword,
    resendOTP,
    deleteUser,
    updateProfile,
    requestPhoneNumberChange,
    verifyPhoneNumberChange,
    requestEmailChange,
    verifyEmailChange,
    clearError,
    onHandleLoginmodal,
    handleProfileNavigation,

    // Queries
    useGetUserProfile,

    // Mutation states for granular loading control
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

    // Utilities
    clearAuthData,
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    formatMemberSince,
  };
};
