'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  LoginData,
  SignupData,
  PhoneSignupData,
  User,
  AuthResponse,
  AuthError,
  AuthState,
  InternalAuthState,
  AuthStorageKeys,
  PasswordValidationResult,
  AuthStorageInterface,
  UseAuthReturn,
  OtpVerificationData,
  SetPasswordData,
  ResendOtpData,
  ProfileUpdateData,
} from '@/types/auth.types';

// Import constants
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/constants/auth.constants';

// Import utilities
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  clearAuthStorage,
  getStorageType,
  parseStoredUser,
  createAuthError,
} from '@/utils/auth.utils';

// Import auth API service
import { authAPI } from '@/lib/api/auth.api';
import { authStorage } from '@/lib/auth/authStorage';

// Remove the old API_BASE_URL and AUTH_ENDPOINTS since they're now in the auth.api.ts file

// Main authentication hook
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const [isLoginOpen, setLoginOpen] = useImmer(false);

  // React Query Mutations
  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
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

        setError(null);
        console.log('Login successful:', data);
      }
    },
    onError: (error: Error) => {
      setError({ message: error.message });
      console.error('Login failed:', error);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authAPI.verifyOtp,
    onSuccess: (data) => {
      if (data.success && data.data && data.data.user && data.data.token) {
        setAuthenticated(
          data.data.user,
          data.data.token,
          data.data.refreshToken || undefined,
          true
        );
        setAuth((draft) => {
          draft.isLoggedIn = true;
          draft.user = data.data!.user || null;
          draft.token = data.data!.token || null;
          draft.refreshToken = data.data!.refreshToken || null;
        });
      }
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
          true // Remember user
        );

        setAuth((draft) => {
          draft.isLoggedIn = true;
          draft.user = user;
          draft.token = data?.accessToken!;
          draft.refreshToken = data?.refreshToken!;
        });
      }
      setError(null);
      console.log('Password set successfully:', data);
    },
    onError: (error: Error) => {
      setError({ message: error.message });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authAPI.resendOtp,
    onSuccess: (data) => {
      setError(null);
      console.log('OTP resent successfully:', data);
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
      console.log('Profile updated successfully:', data);

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
      console.error('Profile update failed:', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: ({ userId }: { userId?: string }) => authAPI.logout(userId),
    onSuccess: () => {
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
      console.warn('Logout request failed:', error);
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

  // React Query for getUserProfile
  const useGetUserProfile = (userId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['userProfile', userId],
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
    // console.log('handleProfileNavigation called');
    // console.log('isAuthenticated:', state.isAuthenticated);

    // if (!state.isAuthenticated) {
    //   console.log('User not authenticated, showing error');
    //   setError({ message: 'Please login to access your profile' });
    //   return;
    // }

    // console.log('Navigating to /user-profile');
    router.push('/user-profile');
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
    console.log('token: setAuthenticated', token);
    console.log('user:setAuthenticated ', user);
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
      console.log('login function called');

      // Validate input
      if (!validatePhoneNumber(loginData.phoneNumber)) {
        throw new Error(ERROR_MESSAGES.INVALID_PHONE);
      }

      if (!loginData.password) {
        throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
      }

      // Use React Query mutation
      return loginMutation.mutateAsync({
        phoneNumber: loginData.phoneNumber,
        countryCode: loginData.countryCode,
        password: loginData.password,
      });
    } catch (error) {
      const authError = createAuthError(
        error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED
      );
      setError(authError);
      throw authError;
    }
  };

  // Signup function
  const signup = useCallback(
    async (signupData: PhoneSignupData): Promise<AuthResponse> => {
      try {
        // Validate input
        if (!validatePhoneNumber(signupData.phoneNumber)) {
          throw new Error(ERROR_MESSAGES.INVALID_PHONE);
        }

        if (!signupData.countryCode) {
          throw new Error(ERROR_MESSAGES.COUNTRY_CODE_REQUIRED);
        }

        if (!signupData.countryId) {
          throw new Error(ERROR_MESSAGES.COUNTRY_ID_REQUIRED);
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
    },
    [signupMutation]
  );

  // Logout function
  const logout = async (id?: string): Promise<void> => {
    try {
      await logoutMutation.mutateAsync({ userId: id });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  };

  // Verify OTP function
  const verifyOTP = useCallback(
    async (
      userId: string,
      otpId: string,
      otp: string
    ): Promise<AuthResponse> => {
      try {
        return verifyOtpMutation.mutateAsync({
          userId,
          otpId,
          otp,
        });
      } catch (error) {
        const authError: AuthError = {
          message:
            error instanceof Error ? error.message : 'OTP verification failed',
        };
        setError(authError);
        throw authError;
      }
    },
    [verifyOtpMutation]
  );

  // Set Password function
  const setPassword = useCallback(
    async (passwordData: SetPasswordData): Promise<AuthResponse> => {
      try {
        const passwordValidation = validatePassword(passwordData.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors[0]);
        }

        if (passwordData.password !== passwordData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        return setPasswordMutation.mutateAsync(passwordData);
      } catch (error) {
        const authError: AuthError = {
          message:
            error instanceof Error ? error.message : 'Failed to set password',
        };
        setError(authError);
        throw authError;
      }
    },
    [setPasswordMutation]
  );

  // Resend OTP function
  const resendOTP = useCallback(
    async (phoneNumber: string, countryCode: string): Promise<AuthResponse> => {
      try {
        return resendOtpMutation.mutateAsync({
          phoneNumber,
          countryCode,
        });
      } catch (error) {
        const authError: AuthError = {
          message:
            error instanceof Error ? error.message : 'Failed to resend OTP',
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
          error instanceof Error ? error.message : 'Failed to update profile',
      };
      setError(authError);
      throw authError;
    }
  };

  const formatMemberSince = (createdAt: string): string => {
    if (!createdAt) return 'Member since -'; // fallback if empty

    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      return 'Member since -'; // fallback if invalid date
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC', // keep consistent formatting
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
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
    isLoginOpen,
    authStorage,

    // Loading states from mutations
    isLoading:
      state.isLoading ||
      signupMutation.isPending ||
      loginMutation.isPending ||
      verifyOtpMutation.isPending ||
      setPasswordMutation.isPending ||
      resendOtpMutation.isPending ||
      updateUserNameAndAvatar.isPending ||
      logoutMutation.isPending,

    // Actions
    login,
    signup,
    logout,
    verifyOTP,
    setPassword,
    resendOTP,
    updateProfile,
    clearError,
    onHandleLoginmodal,
    handleProfileNavigation,

    // Queries
    useGetUserProfile,

    // Mutation states for granular loading control
    signupMutation,
    loginMutation,
    verifyOtpMutation,
    setPasswordMutation,
    resendOtpMutation,
    updateUserNameAndAvatar,
    logoutMutation,

    // Utilities
    validateEmail,
    validatePhoneNumber,
    validatePassword,
    formatMemberSince,
  };
};
