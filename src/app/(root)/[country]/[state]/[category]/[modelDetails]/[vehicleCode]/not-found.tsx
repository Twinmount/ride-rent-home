import Link from "next/link";
import { CarFront } from "lucide-react";
import ScrollToTop from "@/components/general/ScrollToTop";

export default function NotFound() {
  return (
    <>
      <ScrollToTop />
      {/* 404 Page */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <div className="relative flex flex-col items-center">
          {/* Subtle Background 404 */}
          <span className="absolute -top-20 select-none text-[12rem] font-black text-accent-brand opacity-10">
            404
          </span>

          {/* Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
            <CarFront className="h-10 w-10 text-accent-brand" />
          </div>

          {/* Content */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Vehicle Not Found
          </h1>
          <p className="mb-10 max-w-[400px] text-base leading-relaxed text-gray-500">
            The requested vehicle either doesn&apos;t exist or the link you
            followed might be broken. Let&apos;s get you back on the road.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent-brand px-8 text-sm font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg active:scale-95"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>

        {/* Decorative footer element */}
        <div className="absolute bottom-8 text-xs text-gray-400">
          © {new Date().getFullYear()} Your Vehicle Rental Platform
        </div>
      </section>
    </>
  );
}
