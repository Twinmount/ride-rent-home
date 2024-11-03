"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LottieLoader({
  text = "Loading...",
}: {
  text: string;
}) {
  return (
    <div className="flex flex-col justify-center  items-center w-full h-fit relative bottom-10">
      <DotLottieReact
        src="/assets/loading.json"
        loop
        autoplay
        className="w-full max-w-[600px] h-fit relative "
      />
      <span className="absolute bottom-8 italic font-semibold">{text}</span>
    </div>
  );
}
