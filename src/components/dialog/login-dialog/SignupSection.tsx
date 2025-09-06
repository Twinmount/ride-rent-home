'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Lock, Phone, Check, Camera, Upload } from 'lucide-react';
import { useAuthContext } from '@/auth';
import { PhoneInput } from '@/components/ui/phone-input';
import { parsePhoneNumber } from 'react-phone-number-input';

// Country code to ID mapping
const COUNTRY_MAPPINGS: Record<string, number> = {
  '+971': 1, // UAE
  '+1': 2, // USA
  '+44': 3, // UK
  '+91': 4, // India
  '+966': 5, // Saudi Arabia
  '+974': 6, // Qatar
  '+965': 7, // Kuwait
  '+973': 8, // Bahrain
  '+968': 9, // Oman
};

interface SignupSectionProps {
  signupStep: number;
  setSignupStep: (step: number) => void;
  mobileNumber: string;
  setMobileNumber: (number: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  otp: string[];
  setOtp: (otp: string[]) => void;
  otpVerified: boolean;
  setOtpVerified: (verified: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  onLoginSuccess?: () => void;
  onClose: () => void;
}

export const SignupSection = ({
  signupStep,
  setSignupStep,
  mobileNumber,
  setMobileNumber,
  countryCode,
  setCountryCode,
  otp,
  setOtp,
  otpVerified,
  setOtpVerified,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onLoginSuccess,
  onClose,
}: SignupSectionProps) => {
  const {
    signup,
    verifyOTP,
    setPassword: setUserPassword,
    resendOTP,
    updateProfile,
    signupMutation,
    verifyOtpMutation,
    setPasswordMutation,
    resendOtpMutation,
    updateUserNameAndAvatar,
    error,
    clearError,
    auth,
  } = useAuthContext();

  const [signupData, setSignupData] = useState<any>(null);
  const [tempToken, setTempToken] = useState<string>('');

  const [profileName, setProfileName] = useState('');
  console.log('profileName: ', profileName);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const handleClose = () => {
    setSignupStep(1);
    setOtp(['', '', '', '']);
    setOtpVerified(false);
    setMobileNumber('');
    setPassword('');
    setConfirmPassword('');
    setProfileName('');
    setProfileImage(null);
    setProfileImagePreview(null);
    onClose();
  };

  const handleProfileSetupComplete = async () => {
    if (profileName && auth?.user?.id) {
      try {
        clearError();
        const res = await updateProfile(auth.user.id, {
          name: profileName,
          avatar: profileImage || undefined,
        });
        if (res.success) {
          handleClose();
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    } else {
      console.log('Profile update skipped - missing data:', {
        profileName,
        userId: auth?.user?.id,
        authUserId: auth.user?.id,
        signupUserId: signupData?.userId,
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the actual file for API upload
      setProfileImage(file);

      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Check if OTP is complete (4 digits)
      if (newOtp.every((digit) => digit !== '')) {
        handleVerifyOtp(newOtp.join(''));
      }
    }
  };

  const handleSendOtp = async () => {
    if (mobileNumber && countryCode) {
      try {
        clearError();
        const response = await signup({
          phoneNumber: mobileNumber,
          countryCode: countryCode,
          countryId: COUNTRY_MAPPINGS[countryCode] || 1, // Default to 1 if not found
        });

        if (response.success) {
          setSignupData(response.data);
          setSignupStep(2);
          console.log(
            `[SignupSection] OTP sent to ${countryCode}${mobileNumber}`
          );
        }
      } catch (error) {
        console.error('Signup failed:', error);
      }
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    if (signupData && otpCode.length === 4) {
      try {
        clearError();
        const response = await verifyOTP(
          signupData.userId,
          signupData.otpId,
          otpCode
        );

        if (response.success) {
          console.log('response: ', response);
          setOtpVerified(true);
          setTempToken(response?.tempToken || '');
          setTimeout(() => setSignupStep(3), 1000);
        }
      } catch (error) {
        console.error('OTP verification failed:', error);
        setOtpVerified(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (mobileNumber && countryCode) {
      try {
        clearError();
        await resendOTP(mobileNumber, countryCode);
        console.log('OTP resent successfully');
      } catch (error) {
        console.error('Failed to resend OTP:', error);
      }
    }
  };

  const handleSignupComplete = async () => {
    if (password && confirmPassword && tempToken) {
      try {
        clearError();
        const response = await setUserPassword({
          tempToken,
          password,
          confirmPassword,
        });

        if (response.success) {
          setSignupStep(4);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }
      } catch (error) {
        console.error('Password setup failed:', error);
      }
    }
  };

  return (
    <TabsContent value="signup" className="mt-6 space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Signup Error</p>
              <p className="mt-1 text-xs text-red-700">{error.message}</p>
              {error.field && (
                <p className="mt-1 text-xs text-red-600">
                  Field: {error.field}
                </p>
              )}
            </div>
            <button
              onClick={clearError}
              className="text-lg leading-none text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {signupStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Create Your Account</h3>
            <p className="text-sm text-gray-600">
              Enter your mobile number to get started
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupMobile">Mobile Number</Label>
            <PhoneInput
              value={
                countryCode && mobileNumber
                  ? `${countryCode}${mobileNumber}`
                  : ''
              }
              onChange={(value) => {
                if (value) {
                  try {
                    const parsed = parsePhoneNumber(value);
                    if (parsed) {
                      setCountryCode(`+${parsed.countryCallingCode}`);
                      setMobileNumber(parsed.nationalNumber);
                    } else {
                      // Fallback if parsing fails
                      setCountryCode('+971');
                      setMobileNumber(value);
                    }
                  } catch (e) {
                    // Fallback if parsing fails
                    setCountryCode('+971');
                    setMobileNumber(value);
                  }
                } else {
                  setCountryCode('+971');
                  setMobileNumber('');
                }
              }}
              defaultCountry="AE"
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>

          <Button
            className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSendOtp}
            disabled={!mobileNumber || signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Button
              variant="link"
              className="h-auto cursor-pointer p-0 text-orange-500 hover:text-orange-600"
            >
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button
              variant="link"
              className="h-auto cursor-pointer p-0 text-orange-500 hover:text-orange-600"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      )}

      {signupStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Verify Your Mobile Number</h3>
            <p className="text-sm text-gray-600">
              We've sent a 4-digit code to {countryCode} {mobileNumber}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Enter 4-digit OTP</Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <div key={index} className="relative">
                  <Input
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 text-center text-lg font-semibold"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(
                          `otp-${index - 1}`
                        );
                        prevInput?.focus();
                      }
                    }}
                  />
                  {otpVerified && digit && (
                    <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-green-500" />
                  )}
                </div>
              ))}
            </div>
            {otpVerified && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>OTP Verified Successfully!</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button
              variant="link"
              className="cursor-pointer text-orange-500 hover:text-orange-600"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending}
            >
              {resendOtpMutation.isPending ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </div>
      )}

      {signupStep === 3 && (
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Set Your Password</h3>
            <p className="text-sm text-gray-600">
              Create a secure password for your account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupPassword">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                id="signupPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <Button
            className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSignupComplete}
            disabled={
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              setPasswordMutation.isPending
            }
          >
            {setPasswordMutation.isPending
              ? 'Creating Account...'
              : 'Create Account'}
          </Button>
        </div>
      )}

      {signupStep === 4 && (
        <div className="space-y-6 py-4">
          <div className="mb-8 flex justify-center">
            <div className="to-yellow-500 h-16 w-16 rotate-12 transform rounded-lg bg-gradient-to-br from-orange-400 shadow-lg"></div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-gray-900">
              Welcome to Ride.Rent
            </h3>
            <p className="text-sm text-gray-600">
              Let's ride in style, time to set up your profile.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="profileImageUpload"
                className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-orange-400 hover:bg-orange-50"
              >
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="mb-1 h-6 w-6 text-gray-400" />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500">Optional</p>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="h-12 w-full rounded-xl border-gray-300 text-base focus:border-orange-400 focus:ring-orange-400"
              />
              {profileName && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            className="h-12 w-full cursor-pointer rounded-xl bg-gray-900 text-base font-medium text-white hover:bg-gray-800"
            onClick={handleProfileSetupComplete}
            disabled={updateUserNameAndAvatar.isPending}
          >
            {updateUserNameAndAvatar.isPending
              ? 'Updating Profile...'
              : 'Start Booking'}
          </Button>
        </div>
      )}
    </TabsContent>
  );
};
