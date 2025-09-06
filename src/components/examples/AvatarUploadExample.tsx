'use client';

import React from 'react';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAppContext } from '@/context/useAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AvatarUploadExample: React.FC = () => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;

  // Example 1: Using the AvatarUpload component directly
  const handleAvatarUploadSuccess = (avatarUrl: string) => {
    console.log('Avatar uploaded successfully:', avatarUrl);
  };

  const handleAvatarUploadError = (error: string) => {
    console.error('Avatar upload failed:', error);
  };

  // Example 2: Using the useAvatarUpload hook programmatically
  const { uploadAvatar, isUploading, error, clearError } = useAvatarUpload({
    onSuccess: (avatarUrl) => {
      console.log('Programmatic upload success:', avatarUrl);
    },
    onError: (errorMessage) => {
      console.error('Programmatic upload error:', errorMessage);
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const currentUser = user || authStorage.getUser();

  if (!currentUser) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Please log in to upload an avatar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6">
      <h1 className="text-center text-3xl font-bold">Avatar Upload Examples</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Example 1: Using AvatarUpload Component */}
        <Card>
          <CardHeader>
            <CardTitle>Using AvatarUpload Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This component provides a complete UI for avatar upload with
              preview, validation, and upload functionality.
            </p>

            <AvatarUpload
              currentAvatar={currentUser.avatar}
              userName={currentUser.name || 'User'}
              userId={currentUser.id}
              size="xl"
              onUploadSuccess={handleAvatarUploadSuccess}
              onUploadError={handleAvatarUploadError}
            />

            <div className="space-y-1 text-xs text-gray-500">
              <p>
                <strong>Features:</strong>
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Click to upload or drag & drop</li>
                <li>Image preview before upload</li>
                <li>File validation (type & size)</li>
                <li>Upload progress indicator</li>
                <li>Success/error notifications</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Example 2: Using useAvatarUpload Hook */}
        <Card>
          <CardHeader>
            <CardTitle>Using useAvatarUpload Hook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This hook provides programmatic control over avatar upload for
              custom implementations.
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
              />

              {isUploading && (
                <div className="text-center text-blue-600">
                  Uploading avatar...
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearError}
                    className="mt-2"
                  >
                    Clear Error
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs text-gray-500">
              <p>
                <strong>Hook Features:</strong>
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>File validation</li>
                <li>Upload state management</li>
                <li>Error handling</li>
                <li>Success/error callbacks</li>
                <li>Customizable options</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">Component Usage:</h4>
              <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                {`import { AvatarUpload } from '@/components/ui/avatar-upload';

<AvatarUpload
  currentAvatar={user?.avatar}
  userName={user?.name}
  userId={user?.id}
  size="lg"
  onUploadSuccess={(url) => {
    console.log('Success:', url);
  }}
  onUploadError={(error) => {
    console.error('Error:', error);
  }}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Hook Usage:</h4>
              <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                {`import { useAvatarUpload } from '@/hooks/useAvatarUpload';

const { uploadAvatar, isUploading, error } = useAvatarUpload({
  onSuccess: (url) => console.log(url),
  onError: (err) => console.error(err),
});

// Upload a file
await uploadAvatar(file);`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarUploadExample;
