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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Lock, Phone, Check } from 'lucide-react';
import { useAuthContext } from '@/auth';
import { SignupSection } from './SignupSection';

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
  const {
    user,
    auth,
    login,
    logout,
    isLoginOpen,
    onHandleLoginmodal,
    handleProfileNavigation,
    isLoading,
    loginMutation,
    error,
    clearError,
  } = useAuthContext();

  // Login form state using useImmer
  const [loginForm, updateLoginForm] = useImmer({
    phoneNumber: '',
    countryCode: '+971',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);

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

      await login({
        countryCode: loginForm.countryCode,
        password: loginForm.password,
        phoneNumber: loginForm.phoneNumber,
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

    // Reset login form
    updateLoginForm((draft) => {
      draft.phoneNumber = '';
      draft.countryCode = '+971';
      draft.password = '';
      draft.rememberMe = false;
    });

    // Clear any errors
    if (error) {
      clearError();
    }

    onClose();
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
                <div className="flex gap-2">
                  <Select
                    value={loginForm.countryCode}
                    onValueChange={(value) =>
                      updateLoginForm((draft) => {
                        draft.countryCode = value;
                      })
                    }
                  >
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
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="50 123 4567"
                      className="pl-10"
                      value={loginForm.phoneNumber}
                      onChange={(e) =>
                        updateLoginForm((draft) => {
                          draft.phoneNumber = e.target.value;
                        })
                      }
                    />
                  </div>
                </div>
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
      </DialogContent>
    </Dialog>
  );
};
