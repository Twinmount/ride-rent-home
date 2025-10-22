import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import Image from "next/image";

export async function generateMetadata() {
  const canonicalUrl = `https://ride.rent/listing-policy-in`;
  const title = `Vehicle Listing Policy India | Ride.Rent – Legal, Safe & Compliant Rentals`;
  const description = `Ride.Rent's Vehicle Listing Policy for India ensures only legal, safe, and compliant rentals. We list yellow board and self-drive vehicles for a trusted experience.`;

  return {
    title,
    description,
    keywords: `vehicle listing policy India, yellow board rentals, self-drive rentals India, legal car rentals, compliant vehicle rentals, Ride.Rent India, commercial vehicle rentals, rent-a-cab scheme`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Ride.Rent",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function ListingPolicy() {
  const vehicleTypes = [
    {
      emoji: "🚗",
      title: "Yellow-on-Black Plate",
      description:
        "Used for self-drive rentals (cars and bikes). Registered under Rent-a-Cab Scheme, 1989 and Rent-a-Motorcycle Scheme, 1997.",
      plateNumber: "KA 01 AB 1234",
      bgColor: "bg-[#2b2b2b]",
      textColor: "text-white",
      plateColor: "bg-[#2b2b2b] border-[#ffc107] text-[#ffc107]",
      shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
    },
    {
      emoji: "🚕",
      title: "Yellow Board",
      description:
        "Used for chauffeur-driven rentals. Requires commercial driver licence and taxi registration.",
      plateNumber: "DL 03 AC 5678",
      bgColor: "bg-[#fffbea]",
      textColor: "text-[#6b6b6b]",
      plateColor: "bg-[#ffd700] border-[#6b6b6b] text-[#000000]",
      shadow: "shadow-[0_8px_30px_rgb(255,215,0,0.2)]",
    },
    {
      emoji: "🚫",
      title: "White Board",
      description:
        "Private vehicles. Not permitted for any commercial or rental activity under Indian law.",
      plateNumber: "MH 12 XY 4321",
      bgColor: "bg-[#f5f5f5]",
      textColor: "text-[#6b6b6b]",
      plateColor: "bg-white border-[#9e9e9e] text-[#6b6b6b]",
      shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.1)]",
    },
  ];

  const applicabilityData = [
    {
      emoji: "🚗",
      type: "Motorcar (Self-Drive)",
      plate: "Black with Yellow Text",
      legal: "✅ Allowed",
      description: "Registered under Rent-a-Cab Scheme, 1989.",
    },
    {
      emoji: "🚗",
      type: "Motorcar (With Driver)",
      plate: "Yellow with Black Text",
      legal: "✅ Allowed",
      description: "Commercial taxi/fleet vehicles with licensed drivers.",
    },
    {
      emoji: "🛵",
      type: "Two-Wheeler (Self-Drive)",
      plate: "Black with Yellow Text",
      legal: "✅ Allowed",
      description: "Registered under Rent-a-Motorcycle Scheme, 1997.",
    },
    {
      emoji: "🚫",
      type: "Private Vehicle",
      plate: "White with Black Text",
      legal: "❌ Not Allowed",
      description: "Strictly personal use; illegal for rentals.",
    },
  ];

  return (
    <section className="bg-gray-50 pb-12">
      {/* Hero Section with Logo */}
      <div className="px-4 py-4 text-center sm:px-6 md:px-8">
        <div className="mx-auto mb-5 flex justify-center sm:mb-6">
          <Image
            src="/assets/logo/riderent-mobile-logo.webp"
            alt="Ride.Rent Logo"
            width={50}
            height={50}
            className="h-[50px] w-auto sm:h-[60px]"
          />
        </div>
        <h1 className="mb-5 text-xl font-semibold uppercase tracking-wide text-text-primary sm:mb-6 sm:text-3xl md:text-4xl">
          VEHICLE LISTING POLICY / INDIA
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-text-secondary sm:mb-8 sm:text-base md:text-ellipsis
        
        ">
          Ensuring legal, safe, and transparent rentals for motorcars and bikes.
        </p>

        {/* Introduction paragraph */}
        <div className="mx-auto max-w-4xl">
          <p className="text-xs leading-relaxed text-text-tertiary sm:text-sm md:text-sm">
            Ride.Rent is committed to building a transparent, trusted, and
            compliant vehicle rental marketplace across India. To ensure
            passenger safety, regulatory compliance, and fair business
            practices, we strictly enforce this Vehicle Listing Policy.
          </p>
        </div>
      </div>

      {/* Separator line */}
      <div className="mx-auto my-2 h-[1px] w-full bg-gray-300 sm:my-10 md:my-6"></div>

      <MotionDiv className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section 1: Vehicles Eligible for Listing */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="mb-5 text-center text-xl font-semibold text-text-primary sm:mb-6 sm:text-2xl">
            1. Vehicles Eligible for Listing
          </h2>
          <p className="mb-8 text-center text-xs leading-relaxed text-text-tertiary sm:mb-10 sm:text-sm md:text-base">
            Only vehicles legally authorized for commercial use under Indian
            Motor Vehicle regulations can be listed on Ride.Rent. This policy
            applies to all motorcars and two-wheelers offered for rent in India.
          </p>

          {/* Vehicle Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <div
                key={index}
                className={`transform rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 sm:p-8 ${vehicle.bgColor} ${vehicle.shadow}`}
              >
                <div className="mb-4 text-5xl sm:mb-6 sm:text-6xl">
                  {vehicle.emoji}
                </div>
                <h3
                  className={`mb-3 text-lg font-bold leading-tight sm:mb-4 sm:text-xl md:text-2xl ${vehicle.textColor}`}
                >
                  {vehicle.title}
                </h3>
                <p
                  className={`mb-6 text-xs leading-relaxed sm:mb-8 sm:text-sm ${vehicle.textColor}`}
                >
                  {vehicle.description}
                </p>
                <div className="flex justify-center">
                  <div
                    className={`rounded-lg border-[3px] px-4 py-2 font-mono text-sm font-bold tracking-wider sm:px-5 sm:py-3 sm:text-base md:text-lg ${vehicle.plateColor}`}
                  >
                    {vehicle.plateNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Why We Enforce This Policy */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="mb-5 text-center text-xl font-semibold text-text-primary sm:mb-6 sm:text-2xl">
            2. Why We Enforce This Policy
          </h2>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <h3 className="mb-2 text-base font-semibold text-text-secondary sm:mb-3 sm:text-lg">
                a. Legal Compliance
              </h3>
              <p className="text-xs leading-relaxed text-text-tertiary sm:text-sm md:text-base">
                Using private white-board vehicles for commercial rental
                violates the Motor Vehicles Act, 1988. Listing only commercially
                registered vehicles ensures full legal compliance.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-base font-semibold text-text-secondary sm:mb-3 sm:text-lg">
                b. Insurance and Liability
              </h3>
              <p className="text-xs leading-relaxed text-text-tertiary sm:text-sm md:text-base">
                Commercially registered vehicles carry insurance that legally
                covers rentals and passengers. Private vehicles do not. Using
                one could void insurance coverage during accidents.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-base font-semibold text-text-secondary sm:mb-3 sm:text-lg">
                c. Passenger Safety
              </h3>
              <p className="text-xs leading-relaxed text-text-tertiary sm:text-sm md:text-base">
                Commercial vehicles undergo regular inspections and meet safety
                standards, ensuring every ride booked via Ride.Rent is safer and
                reliable.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-base font-semibold text-text-secondary sm:mb-3 sm:text-lg">
                d. Fair Market Practices
              </h3>
              <p className="text-xs leading-relaxed text-text-tertiary sm:text-sm md:text-base">
                Authorized rental operators invest in permits, insurance, and
                taxes. By enforcing this rule, Ride.Rent protects honest
                suppliers and customers alike.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Enforcement and Consequences */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="mb-5 text-center text-xl font-semibold text-text-primary sm:mb-6 sm:text-2xl">
            3. Enforcement and Consequences
          </h2>
          <ul className="space-y-3 text-xs leading-relaxed text-text-tertiary sm:space-y-4 sm:text-sm md:text-base">
            <li className="flex items-start">
              <span className="mr-2 text-orange-500 sm:mr-3">•</span>
              Immediate removal of any non-compliant listings.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500 sm:mr-3">•</span>
              Suspension or permanent deactivation of supplier accounts.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500 sm:mr-3">•</span>
              Potential reporting to local Regional Transport Offices (RTO).
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500 sm:mr-3">•</span>
              Regular audits of listed registration numbers for compliance.
            </li>
          </ul>
        </div>

        {/* Section 4: Reporting Non-Compliant Vehicles */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <h2 className="mb-4 flex items-center justify-center text-center text-xl font-semibold text-text-primary sm:mb-5 sm:text-2xl">
              📩 4. Reporting Non-Compliant Vehicles
            </h2>
            <p className="mb-5 text-xs leading-relaxed text-text-tertiary sm:mb-6 sm:text-sm md:text-base">
              If you booked a vehicle and find it doesn&apos;t match its listing
              — for example, if a white-board vehicle is provided — please
              report it immediately.
            </p>
            <div className="mb-4 sm:mb-5">
              <a
                href="mailto:listing_reports@ride.rent"
                className="text-sm font-normal text-text-secondary underline hover:text-orange-600 sm:text-base md:text-lg"
              >
                listing_reports@ride.rent
              </a>
            </div>
            <p className="text-xs text-[#9e9e9e] sm:text-sm md:text-base">
              Include Booking ID, Vehicle Number, Supplier Name, and photos if
              possible.
            </p>
          </div>
        </div>

        {/* Section 5: Applicability for Cars and Bikes */}
        <div className="mb-16 sm:mb-20 md:mb-24">
          <h2 className="mb-5 text-center text-xl font-semibold text-text-primary sm:mb-6 sm:text-2xl">
            5. Applicability for Cars and Bikes
          </h2>
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-[#ffd700]">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    Vehicle Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    Plate Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    Legal For
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applicabilityData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-xs text-text-tertiary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                      <span className="mr-1 text-base sm:mr-2 sm:text-xl">
                        {item.emoji}
                      </span>
                      {item.type}
                    </td>
                    <td className="px-3 py-3 text-xs text-text-tertiary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                      {item.plate}
                    </td>
                    <td className="px-3 py-3 text-xs font-semibold text-text-secondary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                      {item.legal}
                    </td>
                    <td className="px-3 py-3 text-xs text-text-tertiary sm:px-4 sm:py-4 sm:text-sm md:px-6">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Our Commitment */}
        <div >
          <h2 className="mb-5 text-center text-xl font-semibold text-text-primary sm:mb-6 sm:text-2xl">
            6. Our Commitment
          </h2>
          <p className="mb-7 text-center text-xs leading-relaxed text-text-tertiary sm:mb-8 sm:text-sm md:text-base">
            Ride.Rent stands for trust, compliance, and accountability in the
            vehicle rental industry. By enforcing these listing standards, we
            comply with Indian transport laws and uphold our responsibility as
            a leading mobility platform. Our mission is simple:
          </p>
          <p className="text-center text-sm italic leading-relaxed text-text-primary sm:text-base md:text-lg">
            &quot;Empowering mobility suppliers to manage fleets smarter,
            optimize faster, and grow stronger — while keeping every ride
            legal and secure.&quot;
          </p>
        </div>


        
      </MotionDiv>
    </section>
  );
}
