"use client";

import React, { useState } from "react";
import { useHookForm } from "@/hooks/useHookForm";
import { InternFormFields } from "@/types/interns";
import { sendInternForm } from "@/lib/api/careers-api";
import { uploadSingleFile } from "@/lib/api/fileUpload-api";
import { GcsFilePaths } from "@/constants/fileUpload";
import { ImAttachment } from "react-icons/im";
import Image from "next/image";
import { FormSubmitModal } from "../dialog/form-submit-dialog/FormSubmitModal";
import { FormModalState } from "../dialog/form-submit-dialog/types";

const countryOptions = [
  {
    value: "UAE",
    label: "UAE",
  },
  {
    value: "INDIA",
    label: "INDIA",
  },
];

export default function InternForm({ country }: { country: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [modalState, setModalState] = useState<FormModalState>({
    isOpen: false,
    type: "",
    title: "",
    description: "",
    buttonText: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useHookForm<InternFormFields>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      resume: "",
      collegename: "",
      placementofficer: "",
      type: "intern",
      hiddenField: "",
    },
  });

  const onSubmit = async (data: InternFormFields) => {
    if (data.hiddenField) {
      console.warn("Suspicious activity detected. Submission rejected.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await sendInternForm(JSON.stringify(data), country);
      if (response?.status === "SUCCESS") {
        setModalState({
          isOpen: true,
          type: "success",
          title: "Application Received",
          description:
            "Your application has been successfully submitted. Our team will review your details and get back to you soon!",
          buttonText: "Got it!",
        });
        reset();
        setIsUploaded(false);
        setFileName("");
      } else {
        setModalState({
          isOpen: true,
          type: "error",
          title: "Submission Failed",
          description:
            "Something went wrong while submitting your application. Please check the form and try again.",
          buttonText: "Try again",
        });
      }
      setIsSubmitting(false);
    } catch (err) {
      console.error("Something went wrong: ", err);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFileName("");
    setIsUploaded(false);
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Maximum ${maxSizeMB}MB allowed.`);
      return;
    }

    setFileName(file.name);

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
        GcsFilePaths.INTERNS_RESUMES,
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
    <>
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
              <div className="mb-1 block text-sm font-medium text-gray-700">
                Resume/CV <span className="text-red-500">*</span>
              </div>
              <label
                htmlFor="resumeFile"
                className="flex h-[50px] w-full cursor-pointer items-center rounded-[6px] border border-gray-300 p-3 text-sm text-gray-600 focus:outline-none"
              >
                <span className="m-0 flex items-center gap-3">
                  <ImAttachment size={20} color="grey" />
                  {fileName ? fileName : "Upload your resume here"}
                </span>
                <input
                  type="file"
                  id="resumeFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="hidden"
                  {...register("resume", {
                    required: "Resume is required",
                  })}
                />
              </label>
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

            <div>
              <label
                htmlFor="experience-options"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Preferred country
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="experience-options"
                  className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                  {...register("country", {
                    required: "Preferred country required",
                  })}
                >
                  <option value="">Select an option</option>
                  {countryOptions?.map(({ value, label }) => {
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <Image
                    width={26}
                    height={26}
                    src="/assets/icons/down-arrow-5.svg"
                    alt=""
                  />
                </div>
              </div>
              {errors.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="!mt-5 inline-block h-[1px] w-full bg-gray-200" />

            <div>
              <label
                htmlFor="collegeName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                College Name <span className="text-red-500">*</span>
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
                <span className="text-red-500">*</span>
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
              <input
                {...register("hiddenField")}
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <button
                disabled={isUploading || isSubmitting}
                type="submit"
                className="w-full rounded-[6px] bg-yellow p-4 font-medium text-white transition hover:bg-amber-400"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Submit status modal */}

      <FormSubmitModal modalState={modalState} setModalState={setModalState} />
    </>
  );
}
