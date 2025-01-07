import Link from "next/link";

export default function TrustedReviewsSection() {
  return (
    <div className="mx-auto mb-8 flex w-[97%] flex-col items-center justify-around gap-4 rounded-xl p-4 max-md:text-center md:flex-row">
      {/* left text */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold lg:text-xl">
          GENUINE EXPERIENCES, REAL REVIEWS.
        </span>
        <span className="text-sm lg:text-base">
          Trusted by travelers around the globe.
        </span>
      </div>

      {/* right icons */}
      <div className="flex-center gap-x-6 max-sm:justify-evenly">
        <Link
          href={`https://www.tripadvisor.com/Attraction_Review-g295424-d32767087-Reviews-Ride_Rent_Llc-D
ubai_Emirate_of_Dubai.html`}
          target="_blank"
        >
          <img
            src="/assets/logo/tripadvisor.webp"
            alt="tripadvisor logo"
            className="h-8 sm:h-12 lg:h-14"
          />
        </Link>
        <Link
          href={`https://www.trustpilot.com/review/ride.rent`}
          target="_blank"
        >
          <img
            src="/assets/logo/trustpilot.webp"
            alt="trustpilot logo"
            className="h-5 sm:h-9 lg:h-11"
          />
        </Link>
        <Link href={`https://g.page/r/CXPd6aHEo_hvEAE/review`} target="_blank">
          <img
            src="/assets/logo/google.webp"
            alt="google logo"
            className="h-8 sm:h-16"
          />
        </Link>
      </div>
    </div>
  );
}
