"use client";

import React from "react";
import { useHookForm } from "@/hooks/useHookForm";
import { InternFormFields } from "@/types/interns";

const InternsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useHookForm<InternFormFields>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      resume: null,
      collegename: "",
      placementofficer: "",
    },
  });

  const onSubmit = (data: InternFormFields) => {
    console.log(data);
  };

  return (
    <div className="interns bg-white">
      <div className="mx-auto w-full pb-8 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
        <section className="px-8 py-4">
          <div className="relative flex items-end justify-end overflow-hidden rounded-[16px] md:h-[500px]">
            <div className="absolute left-0 top-0 z-[1] h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1552960366-b330a2f83823?q=80&w=1200"
                alt="interns banner"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative z-[5] mb-4 me-4 ms-4 mt-4 md:mb-0 md:me-0 md:ms-0 md:mt-0 md:max-w-[50%]">
              <div className="relative rounded-[16px] bg-white px-[60px] py-[80px] md:rounded-[0] md:rounded-tl-[16px]">
                <h1 className="mb-3 text-[28px] font-medium text-black">
                  Interns of Ride
                </h1>
                <p className="text-md mb-0 inline-block text-black">
                  Our internship program provides practical exposure in a
                  dynamic work setting. You'll transform academic knowledge into
                  real-world contributions, receive guided mentorship, and
                  develop essential skills to advance your professional journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-8 md:py-16">
          <div className="mb-5 py-3">
            <h3 className="text-[20px] font-medium text-black">
              Your internship experience will include:
            </h3>
          </div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <li className="relative rounded-[12px] border p-6 md:p-8">
              <div className="mb-2 h-[50px] w-[50px]">
                <img
                  className="h-[50px] w-[50px] align-middle"
                  src="/assets/icons/interns/grid-4.svg"
                  alt=""
                />
              </div>
              <h3 className="mb-3 text-base font-medium">
                Owning Impactful Projects
              </h3>
              <p className="m-0 text-sm text-gray-700">
                Take full ownership of real-world projects from start to finish,
                working on products and services that influence thousands of
                customers across the Ride.Rent platform.
              </p>
            </li>
            <li className="relative rounded-[12px] border p-6 md:p-8">
              <div className="mb-2 h-[50px] w-[50px]">
                <img
                  className="h-[50px] w-[50px] align-middle"
                  src="/assets/icons/interns/suitcase.svg"
                  alt=""
                />
              </div>
              <h3 className="mb-3 text-base font-medium">
                Skill Development & Hands-On Learning
              </h3>
              <p className="m-0 text-sm text-gray-700">
                Build valuable skills through guided training, data-driven
                problem solving, and user-focused solution design in a
                fast-paced startup environment.
              </p>
            </li>
            <li className="relative rounded-[12px] border p-6 md:p-8">
              <div className="mb-2 h-[50px] w-[50px]">
                <img
                  className="h-[50px] w-[50px] align-middle"
                  src="/assets/icons/interns/globe-1.svg"
                  alt=""
                />
              </div>
              <h3 className="mb-3 text-base font-medium">
                Global Networking Opportunities
              </h3>
              <p className="m-0 text-sm text-gray-700">
                Connect with peers, teammates, and professionals across teams
                and borders through daily collaboration and curated team events.
              </p>
            </li>
            <li className="relative rounded-[12px] border p-6">
              <div className="mb-2 h-[50px] w-[50px]">
                <img
                  className="h-[50px] w-[50px] align-middle"
                  src="/assets/icons/interns/like.svg"
                  alt=""
                />
              </div>
              <h3 className="mb-3 text-base font-medium">
                Dedicated Mentorship & Career Guidance
              </h3>
              <p className="m-0 text-sm text-gray-700">
                Receive personal mentorship and continuous feedback from
                experienced team members who are committed to supporting your
                growth and success.
              </p>
            </li>
          </ul>
        </section>

        <section className="px-8 py-8 md:py-10">
          <div className="relative overflow-hidden rounded-[16px] pb-[160px] pt-[100px]">
            <div className="absolute left-0 top-0 z-[1] h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200"
                alt="interns form banner"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute left-0 top-0 z-[2] h-full w-full bg-yellow bg-opacity-30"></div>
            </div>
            <div className="relative z-[5] mx-auto px-5 md:max-w-[700px]">
              <div className="relative text-center">
                <h2 className="mb-3 text-[28px] font-semibold text-white drop-shadow-lg md:text-[34px]">
                  Intern opportunities open for 25 batches
                </h2>
                <p className="text-md mb-0 inline-block text-white drop-shadow-lg">
                  Our internships are for final-year students and recent
                  graduates with a degree in computer science or business. The
                  program lasts for 3 months.
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-[7] -mt-24 ml-auto mr-auto w-full rounded-[12px] border bg-white p-5 md:max-w-[700px] md:p-10">
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-[20px] font-medium text-black">
                Apply as an intern
              </h3>
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Indicates a required
                field
              </p>
            </div>
            <div className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-wrap gap-5 md:flex-nowrap">
                  <div className="basis-full md:basis-1/2">
                    <label
                      htmlFor="firstname"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                      {...register("firstname", {
                        required: "First name is required",
                        maxLength: { value: 50, message: "Max 50 characters" },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>

                  <div className="basis-full md:basis-1/2">
                    <label
                      htmlFor="lastname"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                      {...register("lastname", {
                        maxLength: { value: 50, message: "Max 50 characters" },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                    />
                    {errors.lastname && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 md:flex-nowrap">
                  <div className="basis-full md:basis-1/2">
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="basis-full md:basis-1/2">
                    <label
                      htmlFor="phonenumber"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="phonenumber"
                      className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Only numbers allowed",
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="resume"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Resume/CV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="resume"
                    className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                    {...register("resume", { required: "Resume is required" })}
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="mt-2 select-none text-sm text-gray-500">
                    Accepted file types: .pdf , .doc, .docx
                  </p>
                  {errors.resume && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.resume.message}
                    </p>
                  )}
                </div>

                <div className="!mt-5 inline-block h-[1px] w-full bg-gray-200" />

                <div>
                  <label
                    htmlFor="collegeName"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    id="collegeName"
                    className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                    {...register("collegename", {
                      required: "College name is required",
                    })}
                  />
                  {errors.collegename && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.collegename.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="placementOfficer"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    POC / HOD / Placement Officer
                  </label>
                  <input
                    type="text"
                    id="placementOfficer"
                    className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                    {...register("placementofficer", {
                      required: "POC / HOD / Placement Officer is required",
                    })}
                  />
                  {errors.placementofficer && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.placementofficer.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full rounded-[6px] bg-yellow p-4 font-medium text-white transition hover:bg-amber-400"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InternsPage;
