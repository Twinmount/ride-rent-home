import Image from "next/image";
import { aboutGridData } from ".";
import Link from "next/link";

export default function AboutMain() {
  return (
    <div className=" bg-gray-950 ">
      <div className="h-auto min-h-[85vh] flex flex-col gap-y-2 max-w-[100rem] mx-auto px-6 md:px-10 lg:px-28  text-white pt-10">
        <h1 className="text-5xl md:text-6xl font-bold">Ride.Rent</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fit mx-auto my-8 ">
          {aboutGridData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 border border-slate-800 hover:bg-slate-900 transition-colors  p-2 rounded-xl"
            >
              <Image src={item.icon} alt={item.title} width={30} height={30} />
              <div className="font-semibold">{item.title}</div>
              <div className="text-gray-300 text-sm max-w-[90%]">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`https://agent.ride.rent/register`}
          target="_blank"
          rel="noopener noreferrer"
          className={`yellow-gradient w-fit text-xl leading-relaxed font-bold text-black px-2 md:px-4 py-2 rounded-xl mx-auto mb-10`}
        >
          Register Your Fleet Today
        </Link>
      </div>
    </div>
  );
}
