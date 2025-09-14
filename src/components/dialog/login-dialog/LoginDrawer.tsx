// "use client";

// import type React from "react";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   X,
//   Phone,
//   Shield,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Lock,
//   User,
//   Camera,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { PhoneInput } from "react-international-phone";
// import "react-international-phone/style.css";
// import { useAuth } from "@/hooks/useAuth";

// interface LoginDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// type AuthStep = "phone" | "password" | "otp" | "register" | "success";
// type StatusType = "idle" | "loading" | "success" | "error";

// export const LoginDrawer = ({ isOpen, onClose }: LoginDrawerProps) => {
//   const {
//     signup,
//     login,
//     verifyOTP: verifyOTPAPI,
//     setPassword: setPasswordAPI,
//     resendOTP: resendOTPAPI,
//     updateProfile,
//     isLoading: authLoading,
//     error: authError,
//     clearError,
//   } = useAuth();

//   const [step, setStep] = useState<AuthStep>("phone");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [status, setStatus] = useState<StatusType>("idle");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [resendTimer, setResendTimer] = useState(0);
//   const [userExists, setUserExists] = useState<boolean | null>(null);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // API response data
//   const [userId, setUserId] = useState<string>("");
//   const [otpId, setOtpId] = useState<string>("");
//   const [tempToken, setTempToken] = useState<string>("");
//   const [countryCode, setCountryCode] = useState<string>("+1");
//   const [countryId, setCountryId] = useState<number>(1);

//   const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Helper function to extract phone number and country code
//   const extractPhoneData = (fullPhoneNumber: string) => {
//     // React-international-phone returns full phone with country code
//     // We need to extract the country code and phone number separately
//     const countryCodeMatch = fullPhoneNumber.match(/^\+(\d{1,4})/);
//     const extractedCountryCode = countryCodeMatch
//       ? `+${countryCodeMatch[1]}`
//       : "+1";
//     const phoneOnly = fullPhoneNumber.replace(extractedCountryCode, "");

//     return {
//       countryCode: extractedCountryCode,
//       phoneNumber: phoneOnly,
//       fullPhone: fullPhoneNumber,
//     };
//   };

//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//     return undefined;
//   }, [resendTimer]);

//   // Clear auth errors when status changes
//   useEffect(() => {
//     if (authError) {
//       setStatus("error");
//       setStatusMessage(authError.message);
//     }
//   }, [authError]);

//   const resetState = () => {
//     setStep("phone");
//     setPhoneNumber("");
//     setLoginPassword("");
//     setOtp(["", "", "", ""]);
//     setStatus("idle");
//     setStatusMessage("");
//     setResendTimer(0);
//     setUserExists(null);
//     setNewPassword("");
//     setConfirmPassword("");
//     setFullName("");
//     setProfileImage(null);
//     setShowPassword(false);
//     setShowConfirmPassword(false);
//     setUserId("");
//     setOtpId("");
//     setTempToken("");
//     setCountryCode("+1");
//     setCountryId(1);
//     clearError();
//   };

//   const handleClose = () => {
//     resetState();
//     onClose();
//   };

//   const handlePhoneSubmit = async () => {
//     if (!phoneNumber.trim()) return;

//     setStatus("loading");
//     setStatusMessage("Checking phone number...");
//     clearError();

//     try {
//       const phoneData = extractPhoneData(phoneNumber);
//       setCountryCode(phoneData.countryCode);

//       // Try to signup first - if user exists, it will return an error
//       try {
//         const signupResponse = await signup({
//           phoneNumber: phoneData.phoneNumber,
//           countryCode: phoneData.countryCode,
//           countryId: countryId,
//         });

//         if (signupResponse.success && signupResponse.data) {
//           // New user - proceed with OTP verification
//           setUserId(signupResponse.data.userId || "");
//           setOtpId(signupResponse.data.otpId || "");
//           setUserExists(false);
//           setStep("otp");
//           setStatus("success");
//           setStatusMessage("OTP sent successfully! Check your SMS.");
//           setResendTimer(30);

//           // Focus first OTP input
//           setTimeout(() => {
//             otpRefs.current[0]?.focus();
//           }, 100);
//         }
//       } catch (signupError: any) {
//         // If signup fails because user exists, redirect to password step
//         if (
//           signupError?.message?.includes("already exists") ||
//           signupError?.message?.includes("already registered") ||
//           signupError?.message?.includes("User already exists")
//         ) {
//           setUserExists(true);
//           setStep("password");
//           setStatus("success");
//           setStatusMessage("Welcome back! Please enter your password.");
//         } else {
//           throw signupError;
//         }
//       }
//     } catch (error: any) {
//       setStatus("error");
//       setStatusMessage(
//         error?.message || "Failed to verify phone number. Please try again."
//       );
//     }
//   };

//   const handlePasswordLogin = async () => {
//     if (!loginPassword.trim()) return;

//     setStatus("loading");
//     setStatusMessage("Signing you in...");
//     clearError();

//     try {
//       const phoneData = extractPhoneData(phoneNumber);

//       const loginResponse = await login({
//         phoneNumber: phoneData.phoneNumber,
//         countryCode: phoneData.countryCode,
//         password: loginPassword,
//       });

//       if (loginResponse.success) {
//         setStep("success");
//         setStatus("success");
//         setStatusMessage("Login successful!");

//         // Auto-close after success
//         setTimeout(() => {
//           handleClose();
//         }, 2000);
//       }
//     } catch (error: any) {
//       setStatus("error");
//       setStatusMessage(error?.message || "Login failed. Please try again.");
//       setLoginPassword("");
//     }
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     if (value.length > 1) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       otpRefs.current[index + 1]?.focus();
//     }

//     // Auto-verify when all fields are filled
//     if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 4) {
//       setTimeout(() => handleVerifyOTP(newOtp.join("")), 100);
//     }
//   };

//   const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerifyOTP = async (otpCode?: string) => {
//     const code = otpCode || otp.join("");
//     if (code.length !== 4) return;

//     setStatus("loading");
//     setStatusMessage("Verifying OTP...");
//     clearError();

//     try {
//       const verifyResponse = await verifyOTPAPI(userId, otpId, code);

//       if (verifyResponse.success) {
//         // Store tempToken from the verify response
//         setTempToken(verifyResponse.tempToken || "");
//         setStep("register");
//         setStatus("success");
//         setStatusMessage("Phone verified! Complete your profile to continue.");
//       }
//     } catch (error: any) {
//       setStatus("error");
//       setStatusMessage(error?.message || "Invalid OTP. Please try again.");
//       setOtp(["", "", "", ""]);
//       otpRefs.current[0]?.focus();
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setProfileImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRegistration = async () => {
//     if (!fullName.trim() || !newPassword.trim() || !confirmPassword.trim()) {
//       setStatus("error");
//       setStatusMessage("Please fill in all required fields.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setStatus("error");
//       setStatusMessage("Passwords do not match.");
//       return;
//     }

//     if (newPassword.length < 6) {
//       setStatus("error");
//       setStatusMessage("Password must be at least 6 characters long.");
//       return;
//     }

//     setStatus("loading");
//     setStatusMessage("Creating your account...");
//     clearError();

//     try {
//       // Set password first
//       const passwordResponse = await setPasswordAPI({
//         tempToken: tempToken,
//         password: newPassword,
//         confirmPassword: confirmPassword,
//       });

//       if (passwordResponse.success && passwordResponse.data?.userId) {
//         // Update profile with name and avatar if provided
//         if (fullName || profileImage) {
//           const profileData: any = {};
//           if (fullName) profileData.name = fullName;
//           if (profileImage) profileData.avatar = profileImage;

//           await updateProfile(passwordResponse.data.userId, profileData);
//         }

//         setStep("success");
//         setStatus("success");
//         setStatusMessage("Account created successfully!");

//         // Auto-close after success
//         setTimeout(() => {
//           handleClose();
//         }, 2000);
//       }
//     } catch (error: any) {
//       setStatus("error");
//       setStatusMessage(
//         error?.message || "Failed to create account. Please try again."
//       );
//     }
//   };

//   const resendOTP = async () => {
//     setStatus("loading");
//     setStatusMessage("Resending OTP...");
//     clearError();

//     try {
//       const phoneData = extractPhoneData(phoneNumber);
//       const resendResponse = await resendOTPAPI(
//         phoneData.phoneNumber,
//         phoneData.countryCode
//       );

//       if (resendResponse.success && resendResponse.data) {
//         setOtpId(resendResponse.data.otpId || "");
//         setStatus("success");
//         setStatusMessage("OTP resent successfully!");
//         setResendTimer(30);
//         setOtp(["", "", "", ""]);
//         otpRefs.current[0]?.focus();
//       }
//     } catch (error: any) {
//       setStatus("error");
//       setStatusMessage(error?.message || "Failed to resend OTP.");
//     }
//   };

//   const getStatusIcon = () => {
//     const isLoading = status === "loading" || authLoading;
//     switch (status) {
//       case "loading":
//         return <Loader2 className="h-4 w-4 animate-spin" />;
//       case "success":
//         return <CheckCircle className="h-4 w-4 text-green-600" />;
//       case "error":
//         return <AlertCircle className="h-4 w-4 text-red-600" />;
//       default:
//         return authLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : null;
//     }
//   };

//   const isCurrentlyLoading = status === "loading" || authLoading;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={cn(
//           "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
//           isOpen ? "opacity-100" : "pointer-events-none opacity-0"
//         )}
//         onClick={handleClose}
//       />

//       {/* Drawer */}
//       <div
//         className={cn(
//           "fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
//           isOpen ? "translate-x-0" : "translate-x-full"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
//                   <span className="text-lg font-bold">🚗</span>
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">Ride.Rent</h2>
//                   <p className="text-xs text-white/80">
//                     {step === "register" ? "Complete Profile" : "Sign In"}
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleClose}
//                 className="text-white/80 hover:bg-white/10 hover:text-white"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>

//           {/* Status Bar */}
//           <div className="border-b border-border bg-orange-50/50 px-6 py-4">
//             <div className="flex min-h-[20px] items-center gap-2">
//               {getStatusIcon()}
//               <span
//                 className={cn(
//                   "text-sm font-medium transition-colors duration-200",
//                   status === "success" && "text-green-600",
//                   status === "error" && "text-red-600",
//                   isCurrentlyLoading && "text-orange-600",
//                   status === "idle" && "text-muted-foreground"
//                 )}
//               >
//                 {statusMessage || "Enter your phone number to continue"}
//               </span>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 space-y-6 overflow-y-auto p-6">
//             {step === "phone" && (
//               <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
//                 <div className="space-y-2 text-center">
//                   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
//                     <Phone className="h-8 w-8 text-orange-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold">
//                     Welcome to Ride.Rent!
//                   </h3>
//                   <p className="text-balance text-muted-foreground">
//                     Enter your phone number to sign in or create a new account
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label htmlFor="phone" className="text-sm font-medium">
//                       Phone Number
//                     </label>
//                     <div
//                       onKeyDown={(e) =>
//                         e.key === "Enter" && handlePhoneSubmit()
//                       }
//                     >
//                       <PhoneInput
//                         defaultCountry="us"
//                         value={phoneNumber}
//                         onChange={(phone) => setPhoneNumber(phone)}
//                         disabled={isCurrentlyLoading}
//                         style={{
//                           height: "48px",
//                         }}
//                         inputStyle={{
//                           width: "100%",
//                           height: "48px",
//                           fontSize: "18px",
//                           border: "1px solid hsl(var(--border))",
//                           borderRadius: "0 6px 6px 0",
//                           backgroundColor: "hsl(var(--background))",
//                           color: "hsl(var(--foreground))",
//                         }}
//                         countrySelectorStyleProps={{
//                           buttonStyle: {
//                             height: "48px",
//                             border: "1px solid hsl(var(--border))",
//                             borderRight: "none",
//                             backgroundColor: "hsl(var(--background))",
//                             borderRadius: "6px 0 0 6px",
//                           },
//                           dropdownStyleProps: {
//                             style: {
//                               backgroundColor: "hsl(var(--background))",
//                               border: "1px solid hsl(var(--border))",
//                               borderRadius: "6px",
//                               zIndex: 9999,
//                             },
//                           },
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     onClick={handlePhoneSubmit}
//                     disabled={!phoneNumber.trim() || isCurrentlyLoading}
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
//                   >
//                     {isCurrentlyLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Checking...
//                       </>
//                     ) : (
//                       "Continue"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {step === "password" && (
//               <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
//                 <div className="space-y-2 text-center">
//                   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
//                     <Lock className="h-8 w-8 text-orange-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold">Welcome Back!</h3>
//                   <p className="text-balance text-muted-foreground">
//                     Enter your password for{" "}
//                     <span className="font-medium text-foreground">
//                       {phoneNumber}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label htmlFor="password" className="text-sm font-medium">
//                       Password
//                     </label>
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="Enter your password"
//                       value={loginPassword}
//                       onChange={(e) => setLoginPassword(e.target.value)}
//                       className="text-lg focus:border-orange-500 focus:ring-orange-500"
//                       disabled={isCurrentlyLoading}
//                       onKeyDown={(e) =>
//                         e.key === "Enter" && handlePasswordLogin()
//                       }
//                     />
//                   </div>

//                   <Button
//                     onClick={handlePasswordLogin}
//                     disabled={!loginPassword.trim() || isCurrentlyLoading}
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
//                   >
//                     {isCurrentlyLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Signing In...
//                       </>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>

//                   <div className="text-center">
//                     <Button
//                       variant="ghost"
//                       onClick={() => {
//                         setStep("phone");
//                         setLoginPassword("");
//                         setStatus("idle");
//                         setStatusMessage("");
//                         setUserExists(null);
//                       }}
//                       className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
//                     >
//                       Use Different Phone Number
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === "otp" && (
//               <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
//                 <div className="space-y-2 text-center">
//                   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
//                     <Shield className="h-8 w-8 text-orange-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold">Verify Your Phone</h3>
//                   <p className="text-balance text-muted-foreground">
//                     Enter the 4-digit code sent to{" "}
//                     <span className="font-medium text-foreground">
//                       {phoneNumber}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex justify-center gap-3">
//                     {otp.map((digit, index) => (
//                       <Input
//                         key={index}
//                         ref={(el) => {
//                           otpRefs.current[index] = el;
//                         }}
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={1}
//                         value={digit}
//                         onChange={(e) => handleOtpChange(index, e.target.value)}
//                         onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                         className="h-14 w-14 border-2 text-center text-2xl font-bold focus:border-orange-500 focus:ring-orange-500"
//                         disabled={isCurrentlyLoading}
//                       />
//                     ))}
//                   </div>

//                   <div className="text-center">
//                     {resendTimer > 0 ? (
//                       <p className="text-sm text-muted-foreground">
//                         Resend code in {resendTimer}s
//                       </p>
//                     ) : (
//                       <Button
//                         variant="ghost"
//                         onClick={resendOTP}
//                         disabled={isCurrentlyLoading}
//                         className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
//                       >
//                         Resend OTP
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setStep("phone");
//                     setOtp(["", "", "", ""]);
//                     setStatus("idle");
//                     setStatusMessage("");
//                     setUserExists(null);
//                   }}
//                   className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
//                 >
//                   Change Phone Number
//                 </Button>
//               </div>
//             )}

//             {step === "register" && (
//               <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
//                 <div className="space-y-2 text-center">
//                   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
//                     <User className="h-8 w-8 text-orange-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold">
//                     Complete Your Profile
//                   </h3>
//                   <p className="text-balance text-muted-foreground">
//                     Set up your account to start booking with Ride.Rent
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Profile Image Upload */}
//                   <div className="flex flex-col items-center space-y-3">
//                     <div className="relative">
//                       <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
//                         {profileImage ? (
//                           <img
//                             src={profileImage || "/placeholder.svg"}
//                             alt="Profile"
//                             className="h-full w-full object-cover"
//                           />
//                         ) : (
//                           <Camera className="h-8 w-8 text-orange-600" />
//                         )}
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-orange-200 bg-white p-0 hover:bg-orange-50"
//                         onClick={() => fileInputRef.current?.click()}
//                       >
//                         <Camera className="h-4 w-4 text-orange-600" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Optional</p>
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </div>

//                   {/* Full Name */}
//                   <div className="space-y-2">
//                     <label htmlFor="fullName" className="text-sm font-medium">
//                       Full Name *
//                     </label>
//                     <Input
//                       id="fullName"
//                       type="text"
//                       placeholder="Enter your full name"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       disabled={isCurrentlyLoading}
//                       className="focus:border-orange-500 focus:ring-orange-500"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="newPassword"
//                       className="text-sm font-medium"
//                     >
//                       Create Password *
//                     </label>
//                     <div className="relative">
//                       <Input
//                         id="newPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Create a secure password"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         disabled={isCurrentlyLoading}
//                         className="pr-10 focus:border-orange-500 focus:ring-orange-500"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4 text-muted-foreground" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Confirm Password */}
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="confirmPassword"
//                       className="text-sm font-medium"
//                     >
//                       Confirm Password *
//                     </label>
//                     <div className="relative">
//                       <Input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm your password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         disabled={isCurrentlyLoading}
//                         className="pr-10 focus:border-orange-500 focus:ring-orange-500"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="h-4 w-4 text-muted-foreground" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-muted-foreground" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>

//                   <Button
//                     onClick={handleRegistration}
//                     disabled={
//                       !fullName.trim() ||
//                       !newPassword.trim() ||
//                       !confirmPassword.trim() ||
//                       isCurrentlyLoading
//                     }
//                     className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
//                   >
//                     {isCurrentlyLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Creating Account...
//                       </>
//                     ) : (
//                       "Create Account"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {step === "success" && (
//               <div className="space-y-6 text-center duration-300 animate-in slide-in-from-right-4">
//                 <div className="space-y-4">
//                   <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 duration-500 animate-in zoom-in-50">
//                     <CheckCircle className="h-10 w-10 text-green-600" />
//                   </div>
//                   <div className="space-y-2">
//                     <h3 className="text-2xl font-bold text-green-600">
//                       {userExists ? "Welcome Back!" : "Welcome to Ride.Rent!"}
//                     </h3>
//                     <p className="text-muted-foreground">
//                       {userExists
//                         ? "You have been successfully signed in"
//                         : "Your account has been created and verified"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="border-t border-border p-6">
//             <p className="text-balance text-center text-xs text-muted-foreground">
//               By continuing, you agree to Ride.Rent's Terms of Service and
//               Privacy Policy. Standard message and data rates may apply.
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// Step Components
import { PhoneStep } from "./components/PhoneStep";
import { PasswordStep } from "./components/PasswordStep";
import { OtpStep } from "./components/OtpStep";
import { RegisterStep } from "./components/RegisterStep";
import { SuccessStep } from "./components/SuccessStep";

export type AuthStep = "phone" | "password" | "otp" | "register" | "success";
export type StatusType = "idle" | "loading" | "success" | "error";

export interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginDrawer: React.FC<LoginDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  // Auth hook
  const {
    signup,
    login,
    verifyOTP,
    setPassword,
    resendOTP,
    updateProfile,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  // Common State
  const [step, setStep] = useState<AuthStep>("phone");
  const [status, setStatus] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [userExists, setUserExists] = useState<boolean>(false);

  // All other states
  const [drawerState, setDrawerState] = useState<any>({});

  const resetState = () => {
    setStep("phone");
    setStatus("idle");
    setStatusMessage("");
    setUserExists(false);
    setDrawerState({});
    clearError();
  };

  useEffect(() => {
    if (authError) {
      setStatus("error");
      setStatusMessage(authError.message);
    }
  }, [authError]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Status Icon
  const getStatusIcon = () => {
    const isLoading = status === "loading" || authLoading;
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return authLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null;
    }
  };

  const isCurrentlyLoading = status === "loading" || authLoading;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <span className="text-lg font-bold">🚗</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ride.Rent</h2>
                  <p className="text-xs text-white/80">
                    {step === "register" ? "Complete Profile" : "Sign In"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-b border-border bg-orange-50/50 px-6 py-4">
            <div className="flex min-h-[20px] items-center gap-2">
              {getStatusIcon()}
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  status === "success" && "text-green-600",
                  status === "error" && "text-red-600",
                  isCurrentlyLoading && "text-orange-600",
                  status === "idle" && "text-muted-foreground"
                )}
              >
                {statusMessage || "Enter your phone number to continue"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {step === "phone" && (
              <PhoneStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                signup={signup}
                clearError={clearError}
              />
            )}
            {step === "password" && (
              <PasswordStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                login={login}
                clearError={clearError}
              />
            )}
            {step === "otp" && (
              <OtpStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                verifyOTP={verifyOTP}
                resendOTP={resendOTP}
                clearError={clearError}
              />
            )}
            {step === "register" && (
              <RegisterStep
                setStep={setStep}
                setStatus={setStatus}
                setStatusMessage={setStatusMessage}
                setUserExists={setUserExists}
                setDrawerState={setDrawerState}
                drawerState={drawerState}
                isCurrentlyLoading={isCurrentlyLoading}
                setPassword={setPassword}
                updateProfile={updateProfile}
                clearError={clearError}
              />
            )}
            {step === "success" && <SuccessStep userExists={userExists} />}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <p className="text-balance text-center text-xs text-muted-foreground">
              By continuing, you agree to Ride.Rent's Terms of Service and
              Privacy Policy. Standard message and data rates may apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
