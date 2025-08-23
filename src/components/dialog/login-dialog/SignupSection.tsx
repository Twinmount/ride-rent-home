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
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

      // Check if OTP is complete and simulate verification
      if (newOtp.every((digit) => digit !== '') && newOtp.join('') === '1234') {
        setOtpVerified(true);
        setTimeout(() => setSignupStep(3), 1000); // Move to password setup after 1 second
      }
    }
  };

  const handleSendOtp = () => {
    if (firstName && lastName && mobileNumber) {
      setSignupStep(2);
      // Simulate OTP sending
      console.log(`[v0] OTP sent to ${countryCode}${mobileNumber}`);
    }
  };

  const handleSignupComplete = () => {
    console.log('[v0] Signup completed successfully');
  };

  const handleClose = () => {
    setSignupStep(1);
    setOtp(['', '', '', '']);
    setOtpVerified(false);
    setFirstName('');
    setLastName('');
    setMobileNumber('');
  };

  return (
    <TabsContent value="signup" className="mt-6 space-y-4">
      {signupStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="firstName"
                  placeholder="First name"
                  className="pl-10"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signupMobile">Mobile Number</Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+971">🇦🇪 +971</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  <SelectItem value="+966">🇸🇦 +966</SelectItem>
                  <SelectItem value="+974">🇶🇦 +974</SelectItem>
                  <SelectItem value="+965">🇰🇼 +965</SelectItem>
                  <SelectItem value="+973">🇧🇭 +973</SelectItem>
                  <SelectItem value="+968">🇴🇲 +968</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="signupMobile"
                  type="tel"
                  placeholder="50 123 4567"
                  className="pl-10"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSendOtp}
            disabled={!firstName || !lastName || !mobileNumber}
          >
            Send OTP
          </Button>
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
              className="text-orange-500 hover:text-orange-600"
            >
              Resend OTP
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500">
            For demo purposes, use OTP: 1234
          </p>
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
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>
              I agree to the{' '}
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
            </span>
          </div>

          <Button
            className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSignupComplete}
          >
            Create Account
          </Button>
        </div>
      )}
    </TabsContent>
  );
};
