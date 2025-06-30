"use client";
import { useState } from "react";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function JobShareModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const jobUrl = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jobUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <BlurDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            aria-label="Job share dialog"
            className="inline-block whitespace-nowrap rounded bg-gray-100 px-3 py-2 text-sm text-black"
          >
            Share to a friend
          </button>
        </DialogTrigger>
        <DialogContent
          className={
            "box-border flex w-full max-w-[600px] flex-col gap-0 bg-white"
          }
        >
          <DialogHeader>
            <DialogTitle>Share this job</DialogTitle>
          </DialogHeader>
          <div className="mt-6 box-border flex flex-wrap gap-4">
            {/* Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border"
            >
              <Image
                src="/assets/icons/careers/social/twitter.svg"
                alt="twitter"
                width={30}
                height={30}
                loading="lazy"
              />
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border"
            >
              <Image
                src="/assets/icons/careers/social/facebook.svg"
                alt="facebook"
                width={30}
                height={30}
                loading="lazy"
              />
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                jobUrl,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border"
            >
              <Image
                src="/assets/icons/careers/social/linkedin.svg"
                alt="linkedin"
                width={30}
                height={30}
                loading="lazy"
              />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border"
            >
              <Image
                src="/assets/icons/careers/social/whatsapp.svg"
                alt="whatsapp"
                width={30}
                height={30}
                loading="lazy"
              />
            </a>
          </div>
          {/* Copy Link */}
          <div className="mb-4 mt-4">Or copy this link </div>
          <div className="box-border flex w-full items-center gap-2 rounded border">
            <div className="py-43 select-none overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm">
              {jobUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`min-w-[90px] px-2 py-3 ${copied ? "bg-green-100" : "bg-slate-100"}`}
            >
              <span
                className={`whitespace-nowrap text-sm ${copied ? "text-green-500" : "text-black"}`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </div>
        </DialogContent>
      </BlurDialog>
    </>
  );
}
