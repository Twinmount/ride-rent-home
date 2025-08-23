'use client';

import { useState } from 'react';
import { useImmer } from 'use-immer';
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
import { PhoneInput } from '@/components/ui/phone-input';
import { Eye, EyeOff, Lock, User, Phone, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSignupForm, COUNTRY_CODES } from '@/hooks/useAuthForms';

export const SignupSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: basic info, 2: OTP verification, 3: password setup
  const [otp, updateOtp] = useImmer(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signup, verifyOTP, resendOTP, isLoading, error } = useAuth();
  const { 
    formData, 
    errors, 
    updateField, 
    setFieldTouched, 
    validateForm, 
    resetForm 
  } = useSignupForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupStep === 1) {
      // Validate basic info and proceed to signup
      if (!validateForm()) {
        console.error('Please fix the errors before submitting');
        return;
      }

      try {
        const response = await signup(formData);
        if (response.success) {
          console.log('Signup successful! Please verify your phone number.');
          setSignupStep(2); // Move to OTP verification
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'Signup failed');
      }
    } else if (signupStep === 2) {
      // Handle OTP verification
      const otpString = otp.join('');
      if (otpString.length !== 4) {
        console.error('Please enter the complete OTP');
        return;
      }

      try {
        const response = await verifyOTP(formData.phoneNumber, formData.countryCode, otpString);
        if (response.success) {
          console.log('Phone number verified successfully!');
          setOtpVerified(true);
          setSuccess(true);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'OTP verification failed');
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(formData.phoneNumber, formData.countryCode);
      if (response.success) {
        console.log('OTP resent successfully!');
        updateOtp(() => ['', '', '', '']); // Reset OTP input
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    updateField(field, value);
  };

  const handleInputBlur = (field: keyof typeof formData) => {
    setFieldTouched(field);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      updateOtp(draft => {
        draft[index] = value;
      });

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Check if OTP is complete
      const newOtp = [...otp];
      newOtp[index] = value;
      if (newOtp.every((digit) => digit !== '')) {
        setOtpVerified(true);
      }
    }
  };

  const handleClose = () => {
    setSignupStep(1);
    updateOtp(() => ['', '', '', '']);
    setOtpVerified(false);
    setSuccess(false);
    resetForm();
  };

  return (
    <TabsContent value="signup" className="mt-6 space-y-4">
      {signupStep === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="firstName"
                  placeholder="First name"
                  className="pl-10"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleInputBlur('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleInputBlur('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleInputBlur('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupMobile">Mobile Number</Label>
            <div className="flex gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => handleInputChange('countryCode', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="signupMobile"
                  type="tel"
                  placeholder="50 123 4567"
                  className="pl-10"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  onBlur={() => handleInputBlur('phoneNumber')}
                />
              </div>
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleInputBlur('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
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
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleInputBlur('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="rounded"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600 h-auto p-0"
              >
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600 h-auto p-0"
              >
                Privacy Policy
              </Button>
            </span>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms}</p>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error.message}
            </div>
          )}

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 w-full text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      )}

      {signupStep === 2 && (
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSignupStep(1);
            }}
            className="mb-4"
            disabled={isLoading}
          >
            ← Back to Details
          </Button>

          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Verify Your Mobile Number</h3>
            <p className="text-sm text-gray-600">
              We've sent a 4-digit code to {formData.countryCode} {formData.phoneNumber}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 w-full text-white"
              disabled={isLoading || otp.join('').length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              className="text-orange-500 hover:text-orange-600"
              onClick={handleResendOTP}
              disabled={isLoading}
            >
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error.message}
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="space-y-4 text-center">
          <div className="rounded-md bg-green-50 p-6">
            <div className="text-green-600 text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-sm text-green-600">
              Welcome aboard! You can now login with your credentials.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Continue to Login
          </Button>
        </div>
      )}
    </TabsContent>
  );
};
