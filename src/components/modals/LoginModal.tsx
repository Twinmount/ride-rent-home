"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, LogIn } from "lucide-react";
import Link from "next/link";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onOpenChange,
  title = "Login Required",
  message = "Please log in to save vehicles to your favorites",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-6 text-gray-600">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
