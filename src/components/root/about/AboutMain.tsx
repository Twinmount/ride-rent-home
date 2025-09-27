import SafeImage from "@/components/common/SafeImage";

import { aboutGridData } from ".";
import Link from "next/link";

export default function AboutMain() {
  return (
    <div className="bg-gray-950">
      <div className="mx-auto flex h-auto min-h-[85vh] max-w-[100rem] flex-col gap-y-2 px-6 pt-10 text-white md:px-10 lg:px-28">
        <h1 className="text-5xl font-bold md:text-6xl">Ride.Rent</h1>
        <h2 className="mb-3 text-xl font-semibold md:text-2xl">
          Earn More With The Best Aggregation Platform
        </h2>
        <p className="text-gray-300">
          At Ride.Rent, we are transforming the vehicle rental landscape by
          providing a unique platform where vehicle owners can list their
          vehicles and connect directly with users. Founded in 2024 and
          headquartered in Dubai, Ride.Rent was designed to remove unnecessary
          middlemen and bring owners and renters together, ensuring a seamless,
          hassle-free booking experience.
          <br /> <br /> Our platform operates on a zero-commission model, making
          it the most affordable choice for vehicle owners looking to generate
          income from their fleet. With instant bookings, high-quality leads,
          and a vast coverage across the UAE, Ride.Rent offers a quicker return
          on investment for vehicle owners. We provide dedicated profiles for
          each fleet, giving owners maximum visibility and control. Guests can
          browse listings, contact owners, and book vehicles without needing to
          register, ensuring ease of use for all.
        </p>

        <div className="mx-auto my-8 grid w-fit grid-cols-1 gap-4 md:grid-cols-2">
          {aboutGridData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 rounded-xl border border-slate-800 p-2 transition-colors hover:bg-slate-900"
            >
              <SafeImage
                src={item.icon}
                alt={item.title}
                width={30}
                height={30}
              />
              <div className="font-semibold">{item.title}</div>
              <div className="max-w-[90%] text-sm text-gray-300">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`https://agent.ride.rent/ae/register`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mx-auto mb-10 w-fit rounded-xl bg-theme-gradient px-2 py-2 text-xl font-bold leading-relaxed text-black md:px-4`}
        >
          Register Your Fleet Today
        </Link>
      </div>
    </div>
  );
}
