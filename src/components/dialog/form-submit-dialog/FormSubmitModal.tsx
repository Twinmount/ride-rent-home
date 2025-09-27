"use client";
import React from "react";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SafeImage from "@/components/common/SafeImage";

import { Button } from "@/components/ui/button";
import { FormModalState } from "./types";

interface ModalProps {
  modalState: FormModalState;
  setModalState: React.Dispatch<React.SetStateAction<FormModalState>>;
}

export function FormSubmitModal({ modalState, setModalState }: ModalProps) {
  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: modalState?.type,
    });
  };

  return (
    <>
      <BlurDialog open={modalState.isOpen} onOpenChange={closeModal}>
        <DialogContent
          className={
            "flex w-[95%] max-w-[320px] flex-col gap-0 !rounded-[10px] bg-white"
          }
        >
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">Form submit status</DialogTitle>
          </DialogHeader>
          <div>
            <SafeImage
              src={
                modalState?.type === "success"
                  ? "/assets/icons/verify-circle.svg"
                  : modalState?.type === "error"
                    ? "/assets/icons/info-circle.svg"
                    : ""
              }
              alt="modal icon"
              height={100}
              width={100}
              className="mx-auto mb-5 block"
            />
            {modalState.title && (
              <h2 className="mb-4 text-center text-lg font-medium text-gray-800">
                {modalState.title}
              </h2>
            )}
            {modalState.description && (
              <p className="text-center text-sm font-normal text-gray-700">
                {modalState.description}
              </p>
            )}
            {modalState.buttonText && (
              <div className="mt-5 text-center">
                <Button
                  className="rounded bg-gray-100 hover:bg-gray-200"
                  onClick={closeModal}
                >
                  {modalState.buttonText}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </BlurDialog>
    </>
  );
}
