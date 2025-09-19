import React from "react";
import { CheckCircle } from "lucide-react";

export const SuccessStep = ({ userExists }: { userExists?: boolean }) => (
  <div className="space-y-6 text-center duration-300 animate-in slide-in-from-right-4">
    <div className="space-y-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 duration-500 animate-in zoom-in-50">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-600">
          {userExists ? "Welcome Back!" : "Welcome to Ride.Rent!"}
        </h3>
        <p className="text-muted-foreground">
          {userExists
            ? "You have been successfully signed in"
            : "Your account has been created and verified"}
        </p>
      </div>
    </div>
  </div>
);
