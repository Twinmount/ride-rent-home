"use client";

import React from "react";
import { useHookForm } from "@/hooks/useHookForm";
import { InternFormFields } from "@/types/interns";
import { sendInternForm } from "@/lib/api/careers-api";

export default function InternForm({ country }: { country: string }) {
  const selectedCountry = country === "ae" ? "UAE" : "IN";

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
      type: "intern",
    },
  });

  const onSubmit = (data: InternFormFields) => {
    const formData = { ...data, resume: "intern-resume-test" };

    try {
      sendInternForm(JSON.stringify(formData), selectedCountry);
      alert("Form sent successfully!");
    } catch (err) {
      alert("Error occured, Form not sent!");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="mb-4 text-[20px] font-medium text-black">
          Apply as an intern
        </h3>
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Indicates a required field
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
                  maxLength: {
                    value: 50,
                    message: "Max 50 characters",
                  },
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
                  maxLength: {
                    value: 50,
                    message: "Max 50 characters",
                  },
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
              {...register("resume", {
                required: "Resume is required",
              })}
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
  );
}
