import React from "react";
import Link from "next/link";
import CareerForm from "@/components/career/CareerForm";

type Props = {
  searchParams: { jobId?: string };
};

type Section = {
  title: string;
  points: string[];
};

type Job = {
  _id: string;
  jobtitle: string;
  jobdescription: string;
  aboutCompany: string;
  location: string;
  level: string;
  experience: string;
  date: string;
  sections: Section[];
};

type ResponseType = {
  result: Job;
  status: string;
  statusCode: number;
};

async function getJobDetails(jobId: string): Promise<ResponseType> {
  const res = await fetch(`${process.env.API_URL}/jobs/${jobId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch job details");
  }

  return res.json();
}

const CareersDetailsPage = async ({ searchParams }: Props) => {
  const jobId = searchParams.jobId;
  const job = await getJobDetails(jobId as string);

  console.log("job :>> ", job);

  const { result } = job;

  return (
    <div className="careers bg-white">
      <div className="mx-auto w-full pb-8 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
        <section className="px-8 py-8">
          <div className="flex gap-8">
            <div className="w-full md:w-[70%]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="m-0 text-[26px] font-medium text-black">
                  {result?.jobtitle}
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    className="inline-block whitespace-nowrap rounded bg-yellow px-4 py-3 text-sm text-white"
                    href={"#apply-job"}
                  >
                    Apply this job
                  </Link>
                  <Link
                    className="inline-block whitespace-nowrap rounded bg-amber-100 px-4 py-3 text-sm text-yellow"
                    href={"/"}
                  >
                    Share to a friend
                  </Link>
                </div>
              </div>

              <div className="careers__details-content">
                <div className="mb-7 flex items-center gap-12 py-1 text-sm">
                  <p>{result?.location}</p>
                  <p>{result?.date}</p>
                  <p>{result?.level}</p>
                  <p>{result?.experience}</p>
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
                  <CareerForm />
                </div>
              </div>
            </div>
            <div className="hidden w-full ps-5 md:block md:w-[30%]">
              <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[8px]">
                <img
                  src="https://images.unsplash.com/photo-1550850395-c17a8e90ad0a?q=80&w=500"
                  alt=""
                  className="absolute left-0 top-0 h-full w-full object-cover"
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
