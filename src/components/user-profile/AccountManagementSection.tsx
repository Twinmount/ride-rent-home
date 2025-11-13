import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Correct path
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Trash2 } from "lucide-react";

export const AccountManagementSection = ({
  onConfirmDeleteUser,
  isDeletingAccount,
}: any) => {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold leading-none tracking-tight sm:text-xl">
          Account Management
        </h3>
        <p className="text-sm text-gray-500">
          Manage critical aspects of your account, including deletion.
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="delete-account-button"
                className="flex items-center gap-2 font-medium text-red-700"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                Delete Account
              </Label>
              <p className="text-xs text-red-600 sm:text-sm">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  id="delete-account-button"
                  variant="destructive"
                  // onClick={onConfirmDeleteUser}
                  disabled={isDeletingAccount}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md text-sm font-medium transition-all duration-300 ease-out hover:scale-[1.02] sm:w-auto"
                >
                  {isDeletingAccount ? (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Delete Account
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeletingAccount}
                    onClick={onConfirmDeleteUser}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
