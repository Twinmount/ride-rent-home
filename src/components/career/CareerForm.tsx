"use client";

import React, { useState } from "react";
import { useHookForm } from "@/hooks/useHookForm";
import { ApplicationFormValues } from "@/types/careers";
import { sendCareerForm } from "@/lib/api/careers-api";
import { GcsFilePaths } from "@/constants/fileUpload";
import { uploadSingleFile } from "@/lib/api/fileUpload-api";

export default function CareerForm({
  country,
  jobId,
  jobTitle,
}: {
  country: string;
  jobId?: string;
  jobTitle?: string;
}) {
  const selectedCountry = country === "ae" ? "UAE" : "IN";

  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useHookForm<ApplicationFormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      resume: "",
      linkedinprofile: "",
      experience: "",
      currentCompensation: "",
      gender: "",
      expectedCTC: "",
      type: "career",
    },
  });

  const onSubmit = (data: ApplicationFormValues) => {
    try {
      sendCareerForm(
        JSON.stringify({ ...data, jobId, jobTitle }),
        selectedCountry,
      );
      reset();
      setIsUploaded(false);
      alert("Form sent successfully!");
    } catch (err) {
      alert("Error occured, Form not sent!");
    }
  };

  const experienceOptions = [
    { value: "1-2 yrs", label: "1-2 yrs" },
    { value: "2-3 yrs", label: "2-3 yrs" },
    { value: "3-4 yrs", label: "3-4 yrs" },
    { value: "4-5 yrs", label: "4-5 yrs" },
    { value: "5-6 yrs", label: "5-6 yrs" },
    { value: "6-7 yrs", label: "6-7 yrs" },
    { value: "7-8 yrs", label: "7-8 yrs" },
    { value: "8-9 yrs", label: "8-9 yrs" },
    { value: "9-10 yrs", label: "9-10 yrs" },
    { value: "10-11 yrs", label: "10-11 yrs" },
    { value: "11-12 yrs", label: "11-12 yrs" },
    { value: "12-13 yrs", label: "12-13 yrs" },
    { value: "13-14 yrs", label: "13-14 yrs" },
    { value: "14-15 yrs", label: "14-15 yrs" },
    { value: "15-16 yrs", label: "15-16 yrs" },
  ];

  const compensationOptions = [
    { value: "0-3 LPA", label: "0-3 LPA" },
    { value: "3-6 LPA", label: "3-6 LPA" },
    { value: "6-10 LPA", label: "6-10 LPA" },
    { value: "10-15 LPA", label: "10-15 LPA" },
    { value: "15-20 LPA", label: "15-20 LPA" },
    { value: "20-30 LPA", label: "20-30 LPA" },
    { value: "30-50 LPA", label: "30-50 LPA" },
    { value: "50+ LPA", label: "50+ LPA" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Maximum ${maxSizeMB}MB allowed.`);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only .pdf, .doc, and .docx files are allowed.");
      return;
    }

    // Proceed with the upload
    setIsUploading(true);
    try {
      const uploadResponse = await uploadSingleFile(
        GcsFilePaths.CAREERS_RESUMES,
        file,
        country,
      );
      const uploadedFilePath = uploadResponse.result.path;

      setValue("resume", uploadedFilePath);
      setIsUploaded(!!uploadedFilePath);
      clearErrors("resume");
    } catch (error) {
      console.error(error);
      alert("File upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        <h3 className="mb-4 text-[20px] font-medium text-black">
          Apply for this job
        </h3>
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Indicates a required field
        </p>
      </div>
      <div className="mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-[8px] border bg-white p-8"
        >
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
                  required: "Firstname is required",
                  maxLength: {
                    value: 50,
                    message: "Must be under 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
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
                    message: "Must be under 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 md:flex-nowrap">
            <div className="basis-full md:basis-1/2">
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
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
                    message: "Phone number must contain only digits",
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
              id="resumeFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
            />
            <input
              type="hidden"
              {...register("resume", {
                required: "Resume is required",
              })}
            />
            <p className="mt-2 select-none text-sm text-gray-500">
              Accepted file types: .pdf , .doc, .docx
            </p>
            {errors.resume && (
              <p className="mt-1 text-xs text-red-500">
                {errors.resume.message}
              </p>
            )}
            {isUploading && (
              <p className="mt-1 text-sm text-blue-500">Uploading...</p>
            )}
            {isUploaded && (
              <p className="mt-1 text-sm text-green-500">File uploaded</p>
            )}
          </div>

          <div className="!mt-5 inline-block h-[1px] w-full bg-gray-200" />

          <div>
            <label
              htmlFor="linkedin-link"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Linkedin Profile
            </label>
            <input
              type="text"
              id="linkedin-link"
              className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
              {...register("linkedinprofile", {
                pattern: {
                  value:
                    /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/,
                  message: "Enter a valid LinkedIn profile link",
                },
              })}
            />
            {errors.linkedinprofile && (
              <p className="mt-1 text-xs text-red-500">
                {errors.linkedinprofile.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="experience-options"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Years of experience
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="experience-options"
                className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                {...register("experience", {
                  required: "Experience required",
                })}
              >
                <option value="">Select an option</option>
                {experienceOptions?.map(({ value, label }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <img src="/assets/icons/down-arrow-5.svg" alt="" />
              </div>
            </div>
            {errors.experience && (
              <p className="mt-1 text-xs text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="compensation-options"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Current compensation
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="compensation-options"
                className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                {...register("currentCompensation", {
                  required: "Current compensation required",
                })}
              >
                <option value="">Select an option</option>
                {compensationOptions?.map(({ value, label }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <img src="/assets/icons/down-arrow-5.svg" alt="" />
              </div>
            </div>
            {errors.currentCompensation && (
              <p className="mt-1 text-xs text-red-500">
                {errors.currentCompensation.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender-options"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="gender-options"
                className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                {...register("gender", {
                  required: "Gender required",
                })}
              >
                <option value="">Select an option</option>
                {genderOptions?.map(({ value, label }) => {
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <img src="/assets/icons/down-arrow-5.svg" alt="" />
              </div>
            </div>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expected-ctc"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Expected CTC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="expected-ctc"
              className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
              {...register("expectedCTC", {
                required: "Expected CTC is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only numbers are allowed",
                },
              })}
            />
            {errors.expectedCTC && (
              <p className="mt-1 text-xs text-red-500">
                {errors.expectedCTC.message}
              </p>
            )}
          </div>
          <div>
            <button
              disabled={isUploading}
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
