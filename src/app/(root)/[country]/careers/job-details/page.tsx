import React from "react";
import Link from "next/link";
import CareerForm from "@/components/career/CareerForm";
import JobList from "@/components/career/JobList";
import { JobDetailsResponseType, JobsResponseType } from "@/types/careers";
import { JobShareModal } from "@/components/career/JobShareModal";
import { API } from "@/utils/API";
import Image from "next/image";
import { PageProps } from "@/types";

type Props = {
  params: { country: string; state?: string; category?: string };
  searchParams: { [key: string]: string | undefined };
};

async function getJobDetails(
  jobId: string,
  country: string,
): Promise<JobDetailsResponseType> {
  const res = await API({
    path: `/jobs/${jobId}`,
    options: { cache: "no-store" },
    country,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch job details");
  }

  return res.json();
}

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

const CareersDetailsPage = async (props: PageProps) => {
  const { country } = await props.params;
  const searchParams = await props.searchParams;
  const jobId = searchParams.jobId;
  const jobCountry = searchParams.j_country;

  const jobs = await getJobs(country);
  // Ignore current job
  const otherJobs = jobs?.result?.filter((job) => job?.jobId !== jobId);

  const job = await getJobDetails(jobId as string, country);
  const { result } = job;

  return (
    <div className="careers bg-white">
      <div className="mx-auto w-full pb-8 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
        <section className="px-8 py-8">
          <div className="flex gap-8">
            <div className="w-full md:w-[70%]">
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="m-0 mb-2 text-[24px] font-medium text-black md:mb-0">
                  {result?.jobtitle}
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    className="px-23 inline-block whitespace-nowrap rounded bg-yellow px-3 py-2 text-sm text-black"
                    href={"#apply-job"}
                  >
                    Apply this job
                  </Link>
                  <JobShareModal />
                </div>
              </div>

              <div className="careers__details-content">
                <div className="mb-7 flex flex-col gap-2 py-1 text-sm md:flex-row md:items-center md:gap-12">
                  <p>{result?.location}</p>
                  <p>{result?.date}</p>
                  <p>{result?.level}</p>
                  <p>{result?.experience}</p>
                  <p>{result?.country}</p>
                </div>

                {result?.aboutCompany && (
                  <div className="mb-8">
                    <h3 className="mb-4 text-[20px] font-medium text-black">
                      About Ride.Rent
                    </h3>
                    <p className="text-sm text-gray-700">
                      {result?.aboutCompany}
                    </p>
                  </div>
                )}
                {result?.jobdescription && (
                  <div className="mb-8">
                    <h3 className="mb-4 text-[20px] font-medium text-black">
                      About the role
                    </h3>
                    <p className="text-sm text-gray-700">
                      {result?.jobdescription}
                    </p>
                  </div>
                )}

                {result?.sections && result?.sections?.length !== 0 && (
                  <div>
                    {result?.sections?.map(
                      ({
                        title,
                        points,
                      }: {
                        title: string;
                        points: string[];
                      }) => {
                        return (
                          <div className="mb-8" key={title}>
                            <h3 className="mb-4 text-[20px] font-medium text-black">
                              {`${title}:`}
                            </h3>
                            <ul className="ps-0">
                              {points?.map((point: string, i: number) => {
                                return (
                                  <li
                                    key={`${title}-points-${i}`}
                                    className="mb-4 ms-5 list-disc ps-3"
                                  >
                                    <p className="text-sm text-gray-700">
                                      {point}
                                    </p>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}

                <div className="mb-0 mt-6 inline-block w-full" id="apply-job">
                  {/* Career form */}
                  <CareerForm
                    country={country as string}
                    jobId={jobId as string}
                    jobTitle={result?.jobtitle as string}
                    jobCountry={jobCountry as string}
                  />
                </div>

                {/* OTHER JOBS LIST */}

                <JobList
                  title="Other Job Positions"
                  country={country}
                  data={otherJobs}
                />
              </div>
            </div>
            <div className="hidden w-full ps-5 md:block md:w-[30%]">
              <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[8px]">
                <Image
                  src="https://images.unsplash.com/photo-1550850395-c17a8e90ad0a?q=80&w=500"
                  alt=""
                  className="absolute left-0 top-0 h-full w-full object-cover"
                  width={300}
                  height={300}
                />
                <h4 className="relative z-[2] p-4 text-[26px] text-white">
                  Some advertisements goes here
                </h4>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareersDetailsPage;
