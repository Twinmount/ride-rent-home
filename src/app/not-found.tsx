import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-bgGray pb-12 pt-12">
      {/* Top Section */}
      <div className="mb-8 mt-16 flex items-center justify-center">
        <img
          src="/assets/img/general/404.webp"
          alt="404 Not Found"
          className="h-auto w-full max-w-[20rem] object-contain md:max-w-[30rem]"
        />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3 text-center md:gap-1">
        <h1 className="text-2xl font-bold">Spacecraft Rental</h1>
        <h2 className="text-yellow-500 mb-2 text-lg">Coming Soon!</h2>

        <button className="from-yellow-400 to-yellow-300 mb-5 rounded-md bg-gradient-to-r px-4 py-2 text-sm font-extrabold text-black">
          <Link href="/">Check out the active offerings now</Link>
        </button>

        {/* Logo Section */}
        <div className="mb-5">
          <Link href="/" className="flex flex-col items-center">
            <figure className="text-center">
              <img
                src="/assets/logo/riderent-logo.webp"
                alt="Ride Rent Logo"
                className="w-[14rem]"
              />
              <figcaption className="text-sm">
                Vehicles for{" "}
                <span className="font-bold italic text-black">
                  Every Journey
                </span>
              </figcaption>
            </figure>
          </Link>
        </div>

        {/* Bottom Text */}
        <div className="mx-auto w-[95%] md:w-[80%] lg:w-[70%]">
          <p className="text-sm leading-relaxed tracking-wide text-gray-700">
            <span className="font-bold text-black">Ride.Rent</span> ensures that
            you have access to the best and
            <span className="font-bold text-black">
              {" "}
              most affordable car rental services in Dubai.{" "}
            </span>
            Take advantage of our exceptional offers on car rentals throughout
            Dubai, with Ride On Rent, each car is well maintained and
            pre-serviced for efficient performance. <br />
            For your peace of mind, all vehicles are insured and come with
            dedicated agent assistance.
          </p>
        </div>
      </div>
    </section>
  );
}
