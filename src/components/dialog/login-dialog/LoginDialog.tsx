'use client';

import { useState } from 'react';
import { useImmer } from 'use-immer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Lock, Phone, Check, ArrowLeft } from 'lucide-react';
import { useAuthContext } from '@/auth';
import { SignupSection } from './SignupSection';
import { PhoneInput } from '@/components/ui/phone-input';
import { parsePhoneNumber } from 'react-phone-number-input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginDialog = ({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) => {
  const { login, isLoading, loginMutation, error, clearError } =
    useAuthContext();

  // Login form state using useImmer
  const [loginForm, updateLoginForm] = useImmer({
    phoneNumber: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);

  // Forgot password state using useImmer
  const [forgotPasswordForm, updateForgotPasswordForm] = useImmer({
    step: 1,
    mobile: '',
    otp: ['', '', '', ''],
    otpVerified: false,
  });

  const [signupStep, setSignupStep] = useState(1); // 1: basic info, 2: OTP verification, 3: password setup
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Clear any previous errors
      if (error) {
        clearError();
      }

      // Basic validation
      if (!loginForm.phoneNumber.trim()) {
        return;
      }

      if (!loginForm.password.trim()) {
        return;
      }

      // Parse phone number to extract country code and national number
      let countryCode = '';
      let phoneNumber = '';

      try {
        const parsed = parsePhoneNumber(loginForm.phoneNumber);
        console.log('parsed: ', parsed);
        if (parsed) {
          countryCode = `+${parsed.countryCallingCode}`;
          phoneNumber = parsed.nationalNumber;
        } else {
          // Fallback if parsing fails
          countryCode = '+971';
          phoneNumber = loginForm.phoneNumber;
        }
      } catch (e) {
        // Fallback if parsing fails
        countryCode = '+971';
        phoneNumber = loginForm.phoneNumber;
      }

      await login({
        countryCode,
        password: loginForm.password,
        phoneNumber,
        rememberMe: loginForm.rememberMe,
      });

      // Call success callback if login is successful
      onLoginSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the auth context
    }
  };

  const handleClose = () => {
    setSignupStep(1);
    setOtp(['', '', '', '']);
    setOtpVerified(false);
    setMobileNumber('');
    setCountryCode('+971');
    setPassword('');
    setConfirmPassword('');
    setShowSignupPassword(false);
    setShowSignupConfirmPassword(false);

    // Reset forgot password state
    updateForgotPasswordForm((draft) => {
      draft.step = 1;
      draft.mobile = '';
      draft.otp = ['', '', '', ''];
      draft.otpVerified = false;
    });

    // Reset login form
    updateLoginForm((draft) => {
      draft.phoneNumber = '';
      draft.password = '';
      draft.rememberMe = false;
    });

    // Clear any errors
    if (error) {
      clearError();
    }

    onClose();
  };

  const handleSendForgotOtp = () => {
    // TODO: Implement forgot password OTP sending
    console.log('Sending forgot password OTP to:', forgotPasswordForm.mobile);
    updateForgotPasswordForm((draft) => {
      draft.step = 2;
    });
  };

  const handleForgotPasswordOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    updateForgotPasswordForm((draft) => {
      draft.otp[index] = value;
    });

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      nextInput?.focus();
    }

    // Check if OTP is complete (for demo purposes, use 1234)
    const newOtp = [...forgotPasswordForm.otp];
    newOtp[index] = value;
    const otpString = newOtp.join('');
    if (otpString.length === 4) {
      if (otpString === '1234') {
        updateForgotPasswordForm((draft) => {
          draft.otpVerified = true;
        });
        setTimeout(() => {
          updateForgotPasswordForm((draft) => {
            draft.step = 3;
          });
        }, 1000);
      }
    }
  };

  const handlePasswordReset = () => {
    // TODO: Implement password reset
    console.log('Resetting password');
    setShowForgotPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            <span className="text-orange-500">🚗 Ride.</span>
            <span className="text-gray-800">Rent</span>
          </DialogTitle>
        </DialogHeader>
        {showForgotPassword ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForgotPassword(false)}
                className="cursor-pointer p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">Reset Password</h3>
            </div>

            {forgotPasswordForm.step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-600">
                    Enter your mobile number to reset your password
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgotMobile">Mobile Number</Label>
                  <PhoneInput
                    value={forgotPasswordForm.mobile}
                    onChange={(value) =>
                      updateForgotPasswordForm((draft) => {
                        draft.mobile = value || '';
                      })
                    }
                    defaultCountry="AE"
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>

                <Button
                  className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleSendForgotOtp}
                  disabled={!forgotPasswordForm.mobile}
                >
                  Send Reset Code
                </Button>
              </div>
            )}

            {forgotPasswordForm.step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-600">
                    We've sent a 4-digit code to {forgotPasswordForm.mobile}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Enter 4-digit OTP</Label>
                  <div className="flex justify-center gap-2">
                    {forgotPasswordForm.otp.map(
                      (digit: string, index: number) => (
                        <div key={index} className="relative">
                          <Input
                            id={`forgot-otp-${index}`}
                            type="text"
                            maxLength={1}
                            className="h-12 w-12 text-center text-lg font-semibold"
                            value={digit}
                            onChange={(e) =>
                              handleForgotPasswordOtpChange(
                                index,
                                e.target.value
                              )
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === 'Backspace' &&
                                !digit &&
                                index > 0
                              ) {
                                const prevInput = document.getElementById(
                                  `forgot-otp-${index - 1}`
                                );
                                prevInput?.focus();
                              }
                            }}
                          />
                          {forgotPasswordForm.otpVerified && digit && (
                            <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-green-500" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                  {forgotPasswordForm.otpVerified && (
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
                  >
                    Resend OTP
                  </Button>
                </div>

                <p className="text-center text-xs text-gray-500">
                  For demo purposes, use OTP: 1234
                </p>
              </div>
            )}

            {forgotPasswordForm.step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-600">
                    Create a new password for your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a new password"
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
                  <Label htmlFor="confirmNewPassword">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handlePasswordReset}
                >
                  Reset Password
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-4">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Welcome Back</h3>
                <p className="text-sm text-gray-600">Sign in to your account</p>
              </div>
              <div className="space-y-4">
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Login Failed
                        </p>
                        <p className="mt-1 text-xs text-red-700">
                          {error.message}
                        </p>
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

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <PhoneInput
                    value={loginForm.phoneNumber}
                    onChange={(value) =>
                      updateLoginForm((draft) => {
                        draft.phoneNumber = value || '';
                      })
                    }
                    defaultCountry="AE"
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={loginForm.password}
                      onChange={(e) =>
                        updateLoginForm((draft) => {
                          draft.password = e.target.value;
                        })
                      }
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={loginForm.rememberMe}
                      onChange={(e) =>
                        updateLoginForm((draft) => {
                          draft.rememberMe = e.target.checked;
                        })
                      }
                    />
                    <span>Remember me</span>
                  </label>
                  <Button
                    variant="link"
                    className="h-auto cursor-pointer p-0 text-orange-500 hover:text-orange-600"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  className="w-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleLogin}
                  disabled={
                    isLoading ||
                    loginMutation.isPending ||
                    !loginForm.phoneNumber.trim() ||
                    !loginForm.password.trim()
                  }
                >
                  {isLoading || loginMutation.isPending
                    ? 'Logging in...'
                    : 'Login'}
                </Button>

                {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div> */}

                {/* <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer bg-transparent"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer bg-transparent"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
                </Button>
              </div> */}
              </div>
            </TabsContent>

            <SignupSection
              signupStep={signupStep}
              setSignupStep={setSignupStep}
              mobileNumber={mobileNumber}
              setMobileNumber={setMobileNumber}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              otp={otp}
              setOtp={setOtp}
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
              showPassword={showSignupPassword}
              setShowPassword={setShowSignupPassword}
              showConfirmPassword={showSignupConfirmPassword}
              setShowConfirmPassword={setShowSignupConfirmPassword}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onLoginSuccess={onLoginSuccess}
              onClose={handleClose}
            />
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
