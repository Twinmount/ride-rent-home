"use client";

import React from "react";
import Link from "next/link";
import { JobResponse } from "@/types/careers";
import { useImmer } from "use-immer";

function JobList({
  title,
  data,
  country,
}: {
  title: string;
  country: string;
  data: JobResponse[];
}) {
  const [showAll, setShowAll] = useImmer(false);
  const jobList = showAll ? data : data?.slice(0, 4);

  return (
    <section
      className="open-job-positions px-8 py-8 md:py-16"
      id="open-positions"
    >
      <div className="mx-auto max-w-[700px]">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="mb-0 text-[22px] font-medium text-black">{title}</h2>
          {data?.length > 4 && (
            <div className="job-more">
              <a
                className="cursor-pointer text-sm text-yellow"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show less" : "View all"}
              </a>
            </div>
          )}
        </div>
        <div className="open-job-positions__list-block">
          <ul className="open-job-positions__list flex flex-col gap-6">
            {jobList?.map(
              ({
                _id: jobId,
                jobtitle,
                location,
                level,
                experience,
                country: jobCountry,
              }) => {
                return (
                  <li
                    key={jobId}
                    className="flex flex-col justify-between rounded-[6px] border-[1px] border-solid border-gray-200 p-5 text-left md:flex-row md:items-center"
                  >
                    <div className="position-infos">
                      <h4 className="mb-1 font-medium text-black">
                        {jobtitle}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {`${location} | ${level} | ${experience} | ${jobCountry}`}
                      </p>
                    </div>
                    <div className="job-apply-action mt-5 md:mt-0">
                      <Link
                        className="inline-block rounded bg-amber-100 px-6 py-2 text-sm text-yellow"
                        href={`/${country}/careers/job-details?jobId=${jobId}&j_country=${jobCountry}`}
                      >
                        Apply Now
                      </Link>
                    </div>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JobList;
