import React from "react";
import Link from "next/link";
import { PageProps } from "@/types";
import JobList from "@/components/career/JobList";
import { JobsResponseType } from "@/types/careers";
import { API } from "@/utils/API";

export async function generateMetadata(props: PageProps) {
  const { country } = await props.params;

  const canonicalUrl = `https://ride.rent/${country}/careers`;
  const title = `Ride.Rent India Careers | Work With Us, Innovate In Mobility.`;
  const description = `Build your career with Ride.Rent India, the fastest-growing vehicle rental marketplace. Find job openings, internships, opportunities to innovate in mobility.`;

  return {
    title,
    description,
    keywords: `Ride Rent, career, job, apply job`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// Get Job list

async function getJobs(country: string): Promise<JobsResponseType> {
  const res = await API({
    path: "/jobs/client-job-list",
    options: { cache: "no-store" },
    country,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

const CareersPage = async (props: PageProps) => {
  const { country } = await props.params;
  const jobs = await getJobs(country);

  return (
    <div className="careers bg-white">
      <div className="mx-auto w-full pb-8 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
        <section className="careers__banner px-8 py-4">
          <div className="relative flex items-end justify-end overflow-hidden rounded-[16px] md:h-[400px]">
            <div className="absolute left-0 top-0 z-[1] h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=80&w=1200"
                alt="career banner"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative z-[5] mb-4 me-4 ms-4 mt-60 w-full md:mb-0 md:me-0 md:ms-0 md:mt-0 md:max-w-[360px]">
              <div className="relative rounded-[16px] bg-white p-[40px] md:rounded-[0] md:rounded-tl-[16px]">
                <h1 className="mb-3 text-[28px] font-medium text-black">
                  Join Our Journey
                </h1>
                <p className="text-md mb-6 inline-block text-black">
                  Be part of the team redefining rentals across the world.
                </p>
                <div>
                  <Link
                    className="inline-block rounded bg-yellow px-4 py-3 font-medium text-white"
                    href={"/"}
                  >
                    Open positions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers__feature-section px-8 py-8 md:py-16">
          <div className="mx-auto mb-10 max-w-[500px] text-center">
            <h2 className="mb-2 text-[28px] font-medium text-black">
              What Drives Us
            </h2>
            <p className="text-md inline-block text-black">
              Our values guide every decision, shape our culture, and power the
              journey ahead.
            </p>
          </div>
          <div className="careers__features-list flex flex-col gap-10 md:flex-row">
            <div className="careers__feature relative basis-1/3 overflow-hidden rounded-[16px] md:min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute left-0 top-0 flex h-full w-full items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white">
                <div>
                  <h3 className="mb-3 text-[22px] font-medium text-white">
                    People First
                  </h3>
                  <p className="inline-block text-sm text-white">
                    We believe every person counts. Whether it’s our users,
                    partners, or teammates, mutual respect and inclusion drive
                    our culture.
                  </p>
                </div>
              </div>
            </div>
            <div className="careers__feature relative basis-1/3 overflow-hidden rounded-[16px] md:min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-0 top-0 flex h-full w-full items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white">
                <div>
                  <h3 className="mb-3 text-[22px] font-medium text-white">
                    Think Beyond Limits
                  </h3>
                  <p className="inline-block text-sm text-white">
                    Innovation starts with ambition. We push boundaries,
                    question norms, and design bold solutions that shape the
                    future of rentals.
                  </p>
                </div>
              </div>
            </div>
            <div className="careers__feature relative basis-1/3 overflow-hidden rounded-[16px] md:min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1554902843-260acd0993f8?q=80&w=800"
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-0 top-0 flex h-full w-full items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white">
                <div>
                  <h3 className="mb-3 text-[22px] font-medium text-white">
                    Honor the Milestones
                  </h3>
                  <p className="inline-block text-sm text-white">
                    Every step forward is worth recognizing. We take time to
                    appreciate progress, acknowledge effort, and celebrate
                    success together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hire-steps-section flex flex-col gap-3 px-8 py-8 md:flex-row md:py-16">
          <div className="relative flex items-end justify-end overflow-hidden rounded-[16px] md:basis-1/2">
            <img
              src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=800"
              alt=""
              className="absolute left-0 top-0 z-[1] h-full w-full object-cover"
              loading="lazy"
            />
            <div className="relative z-[5] mb-4 me-4 ms-4 mt-60 w-full rounded-[16px] bg-white p-[40px] md:mb-0 md:me-0 md:ms-0 md:mt-0 md:max-w-[360px] md:rounded-[0] md:rounded-tl-[16px]">
              <h3 className="mb-3 text-[28px] font-medium text-black">
                Our Hiring Journey
              </h3>
              <p className="text-md mb-6 inline-block text-black">
                Every great team starts with the right people, here’s how we
                find and welcome ours.
              </p>
              <div>
                <Link
                  className="inline-block rounded bg-yellow px-4 py-3 font-medium text-white"
                  href={"/"}
                >
                  Open positions
                </Link>
              </div>
            </div>
          </div>
          <div className="hire-steps__section mt-10 md:basis-1/2">
            <ul className="hire-steps__list ps-8 md:ps-20">
              <li className="relative border-s-[1px] border-solid border-gray-300 pb-14 ps-9">
                <div className="absolute left-0 top-0 z-[1] -ms-6 flex h-[58px] w-[46px] items-center justify-center bg-white">
                  <img
                    className="h-[34px] w-[34px] align-middle"
                    src="/assets/icons/careers/attachment.svg"
                    alt=""
                  />
                </div>
                <div className="mb-1 text-sm text-yellow">Step 1</div>
                <h3 className="mb-2 text-base font-medium">Apply</h3>
                <p className="text-sm text-gray-700">
                  We’ll review your CV and get in touch to schedule an initial
                  call with one of our recruiters.
                </p>
              </li>
              <li className="relative border-s-[1px] border-solid border-gray-300 pb-14 ps-9">
                <div className="absolute left-0 top-0 z-[1] -ms-6 flex h-[58px] w-[46px] items-center justify-center bg-white">
                  <img
                    className="h-[34px] w-[34px] align-middle"
                    src="/assets/icons/careers/phone.svg"
                    alt=""
                  />
                </div>
                <div className="mb-1 text-sm text-yellow">Step 2</div>
                <h3 className="mb-2 text-base font-medium">
                  Introductory Call
                </h3>
                <p className="text-sm text-gray-700">
                  You'll have a casual conversation with our recruiter to
                  discuss the role, learn more about Ride.Rent, and explore
                  whether there's a strong cultural fit.
                </p>
              </li>
              <li className="relative border-s-[1px] border-solid border-gray-300 pb-14 ps-9">
                <div className="absolute left-0 top-0 z-[1] -ms-6 flex h-[58px] w-[46px] items-center justify-center bg-white">
                  <img
                    className="h-[34px] w-[34px] align-middle"
                    src="/assets/icons/careers/users-more.svg"
                    alt=""
                  />
                </div>
                <div className="mb-1 text-sm text-yellow">Step 3</div>
                <h3 className="mb-2 text-base font-medium">Interview</h3>
                <p className="text-sm text-gray-700">
                  You'll meet with your potential manager for a role-specific
                  discussion. This is your chance to showcase your experience
                  and how you solve real challenges.
                </p>
              </li>
              <li className="relative border-s-[1px] border-solid border-gray-300 pb-14 ps-9">
                <div className="absolute left-0 top-0 z-[1] -ms-6 flex h-[58px] w-[46px] items-center justify-center bg-white">
                  <img
                    className="h-[34px] w-[34px] align-middle"
                    src="/assets/icons/careers/list-right.svg"
                    alt=""
                  />
                </div>
                <div className="mb-1 text-sm text-yellow">Step 4</div>
                <h3 className="mb-2 text-base font-medium">
                  Take-Home Assignment
                </h3>
                <p className="text-sm text-gray-700">
                  You’ll receive a short task that reflects the kind of work
                  you'd do with us. This helps us understand your
                  problem-solving approach and creativity.
                </p>
              </li>
              <li className="relative border-s-[1px] border-solid border-gray-300 pb-14 ps-9">
                <div className="absolute left-0 top-0 z-[1] -ms-6 flex h-[58px] w-[46px] items-center justify-center bg-white">
                  <img
                    className="h-[34px] w-[34px] align-middle"
                    src="/assets/icons/careers/trophy.svg"
                    alt=""
                  />
                </div>
                <div className="mb-1 text-sm text-yellow">Step 5</div>
                <h3 className="mb-2 text-base font-medium">Final Offer</h3>
                <p className="text-sm text-gray-700">
                  If everything aligns, we’ll schedule a call to walk you
                  through the offer details and next steps.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <JobList title="Open Positions" country={country} data={jobs?.result} />
      </div>
    </div>
  );
};

export default CareersPage;
