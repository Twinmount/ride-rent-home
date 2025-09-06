'use client';

import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/useAppContext';

interface UseAvatarUploadOptions {
  userId?: string;
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface UseAvatarUploadReturn {
  uploadAvatar: (file: File) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAvatarUpload = (
  options: UseAvatarUploadOptions = {}
): UseAvatarUploadReturn => {
  const {
    userId,
    onSuccess,
    onError,
    maxSizeInMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { auth } = useAppContext();
  const { updateProfile, user, authStorage } = auth;

  // Get user ID from context if not provided
  const currentUserId = userId || user?.id || authStorage.getUser()?.id;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
      }

      // Check file size
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return `File size must be less than ${maxSizeInMB}MB`;
      }

      return null;
    },
    [allowedTypes, maxSizeInMB]
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<void> => {
      // Clear previous errors
      setError(null);

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        throw new Error(validationError);
      }

      // Check if user is logged in
      if (!currentUserId) {
        const errorMessage = 'Please log in to upload avatar';
        setError(errorMessage);
        onError?.(errorMessage);
        throw new Error(errorMessage);
      }

      setIsUploading(true);

      try {
        // Use the existing updateProfile function
        const response = await updateProfile(currentUserId, {
          name: user?.name || 'User', // Keep existing name
          avatar: file, // Pass the File object
        });

        if (response.success) {
          const avatarUrl = response.data?.avatar;
          if (avatarUrl) {
            onSuccess?.(avatarUrl);
          }
        } else {
          throw new Error(response.message || 'Failed to update avatar');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload avatar';
        setError(errorMessage);
        onError?.(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [currentUserId, user?.name, updateProfile, validateFile, onSuccess, onError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadAvatar,
    isUploading,
    error,
    clearError,
  };
};

export default useAvatarUpload;
