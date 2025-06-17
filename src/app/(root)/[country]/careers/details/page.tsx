import Link from "next/link";
import React from "react";

const CareersDetailsPage = () => {
  return (
    <div className="careers bg-white">
      <div className="mx-auto w-full pb-8 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%]">
        <section className="px-8 py-8">
          <div className="flex gap-8">
            <div className="w-full md:w-[70%]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="m-0 text-[26px] font-medium text-black">
                  Assistant Category Manager
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    className="inline-block whitespace-nowrap rounded bg-yellow px-4 py-3 text-sm text-white"
                    href={"/"}
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
                <div className="mb-7 flex items-center gap-12 py-1">
                  <p>Remote</p>
                  <p>12-June-2025</p>
                  <p>Junior Level</p>
                  <p>3-5 Years</p>
                </div>

                <div className="mb-8">
                  <h3 className="mb-4 text-[20px] font-medium text-black">
                    About Ride.Rent
                  </h3>
                  <p className="text-sm text-gray-700">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using 'Content here, content here', making it look like
                    readable English. Many desktop publishing packages and web
                    page editors now use Lorem Ipsum as their default model
                    text, and a search for 'lorem ipsum' will uncover many web
                    sites still in their infancy. Various versions have evolved
                    over the years, sometimes by accident, sometimes on purpose
                    injected humour and the like.
                  </p>
                </div>
                <div className="mb-8">
                  <h3 className="mb-4 text-[20px] font-medium text-black">
                    About the role
                  </h3>
                  <p className="text-sm text-gray-700">
                    The point of using Lorem Ipsum is that it has a more-or-less
                    normal distribution of letters, as opposed to using 'Content
                    here, content here', making it look like readable English.
                    Many desktop publishing packages and web page editors now
                    use Lorem Ipsum as their default model text, and a search
                    for 'lorem ipsum' will uncover many web sites still in their
                    infancy.
                  </p>
                </div>
                <div className="mb-8">
                  <h3 className="mb-4 text-[20px] font-medium text-black">
                    What you will do:
                  </h3>
                  <ul className="ps-0">
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        Many desktop publishing packages and web page editors
                        now use Lorem Ipsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites
                        still in their infancy. Many desktop publishing packages
                        and web page editors now use Lorem Ipsum as their
                        default model text, and a search for 'lorem ipsum' will
                        uncover many web sites still in their infancy.
                      </p>
                    </li>
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        The point of using Lorem Ipsum is that it has a
                        more-or-less normal distribution of letters, as opposed
                        to using 'Content here, content here', making it look
                        like readable English.
                      </p>
                    </li>
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        Many desktop publishing packages and web page editors
                        now use Lorem Ipsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites
                        still in their infancy.
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="mb-8">
                  <h3 className="mb-4 text-[20px] font-medium text-black">
                    Nice to have:
                  </h3>
                  <ul className="ps-0">
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        Many desktop publishing packages and web page editors
                        now use Lorem Ipsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites
                        still in their infancy.
                      </p>
                    </li>
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        The point of using Lorem Ipsum is that it has a
                        more-or-less normal distribution of letters, as opposed
                        to using 'Content here, content here', making it look
                        like readable English.
                      </p>
                    </li>
                    <li className="mb-4 ms-5 list-disc ps-3">
                      <p className="text-sm text-gray-700">
                        Many desktop publishing packages and web page editors
                        now use Lorem Ipsum as their default model text, and a
                        search for 'lorem ipsum' will uncover many web sites
                        still in their infancy.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="mb-0 mt-6 inline-block w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="mb-4 text-[20px] font-medium text-black">
                      Apply for this job
                    </h3>
                    <p className="text-sm text-gray-500">
                      <span className="text-red-500">*</span> Indicates a
                      required field
                    </p>
                  </div>

                  <div className="mt-4">
                    <form className="space-y-4 rounded-[8px] border bg-white p-8">
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
                            name="firstname"
                            className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                          />
                        </div>

                        <div className="basis-full md:basis-1/2">
                          <label
                            htmlFor="lastname"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-5 md:flex-nowrap">
                        <div className="basis-full md:basis-1/2">
                          <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="email"
                            name="email"
                            className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                          />
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
                            name="phonenumber"
                            className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="resume-cv"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Resume/CV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          id="resume-cv"
                          name="resume-cv"
                          className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                        />
                        <p className="mt-2 select-none text-sm text-gray-500">
                          Accepted file types: .pdf , .doc, .docx
                        </p>
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
                          name="linkedin-link"
                          className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                        />
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
                            name="experience"
                            className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                          >
                            <option value="">Select an option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <img src="/assets/icons/down-arrow-5.svg" alt="" />
                          </div>
                        </div>
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
                            name="compensation"
                            className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                          >
                            <option value="">Select an option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <img src="/assets/icons/down-arrow-5.svg" alt="" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="gender-options"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Gender
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="gender-options"
                            name="gender"
                            className="w-full appearance-none rounded-[6px] border border-gray-300 p-3 pr-8 focus:outline-none"
                          >
                            <option value="">Select an option</option>
                            <option value="option1">Male</option>
                            <option value="option2">Female</option>
                            <option value="option3">Other</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <img src="/assets/icons/down-arrow-5.svg" alt="" />
                          </div>
                        </div>
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
                          name="expected-ctc"
                          className="w-full rounded-[6px] border border-gray-300 p-3 focus:outline-none"
                        />
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
