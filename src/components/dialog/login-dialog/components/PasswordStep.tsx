import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";

export const PasswordStep = ({
  setStep,
  setStatus,
  setStatusMessage,
  setUserExists,
  setDrawerState,
  drawerState,
  isCurrentlyLoading,
  login,
  clearError,
}: any) => {
  const [loginPassword, setLoginPassword] = useState("");

  const handlePasswordLogin = async () => {
    if (!loginPassword.trim()) return;
    setStatus("loading");
    setStatusMessage("Signing you in...");
    clearError();

    try {
      const loginResponse = await login({
        phoneNumber: drawerState.phoneNumber,
        countryCode: drawerState.countryCode,
        password: loginPassword,
      });

      if (loginResponse.success) {
        setStep("success");
        setStatus("success");
        setStatusMessage("Login successful!");
      }
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || "Login failed. Please try again.");
      setLoginPassword("");
    }
  };

  return (
    <div className="space-y-6 duration-300 animate-in slide-in-from-right-4">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
          <Lock className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold">Welcome Back!</h3>
        <p className="text-balance text-muted-foreground">
          Enter your password for{" "}
          <span className="font-medium text-foreground">
            {drawerState.phoneNumber}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="text-lg focus:border-orange-500 focus:ring-orange-500"
            disabled={isCurrentlyLoading}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
          />
        </div>

        <Button
          onClick={handlePasswordLogin}
          disabled={!loginPassword.trim() || isCurrentlyLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-6 text-lg text-white hover:from-orange-600 hover:to-orange-700"
        >
          {isCurrentlyLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => {
              setStep("phone");
              setLoginPassword("");
              setStatus("idle");
              setStatusMessage("");
              setUserExists(null);
            }}
            className="text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            Use Different Phone Number
          </Button>
        </div>
      </div>
    </div>
  );
};
