import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { MotionH1 } from "@/components/general/framer-motion/MotionElm";

export async function generateMetadata() {
  const canonicalUrl = `https://ride.rent/global-data-deletion-policy`;
  const title = `Global Data Deletion & Retention Policy | Ride.Rent`;
  const description = `Ride.Rent's global Data Deletion and Retention Policy explains how we collect, process, retain, and delete personal data in accordance with GDPR, CCPA, PDPL, and DPDP compliance standards.`;

  return {
    title,
    description,
    keywords: `data deletion, data retention, GDPR, CCPA, PDPL, DPDP, privacy policy, data protection, Ride Rent`,
    openGraph: { title, description, url: canonicalUrl, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: canonicalUrl },
  };
}

interface ComplianceItem {
  title: string;
  desc: string;
}

interface InfoItem {
  label: string;
  value: string;
  isEmail?: boolean;
}

interface PolicySection {
  id: number;
  title: string;
  content: string;
  intro?: string;
  items?: string[] | ComplianceItem[];
  info?: InfoItem[];
  highlight?: string;
}

const policyData: PolicySection[] = [
  {
    id: 1,
    title: "Policy Overview",
    content:
      "Ride.Rent is committed to protecting the privacy and rights of individuals whose data we collect. This policy describes our approach to data lifecycle management — including collection, retention, storage, and deletion — ensuring alignment with global data protection frameworks.",
  },
  {
    id: 2,
    title: "Legal Basis and Global Compliance Alignment",
    content: "compliance",
    items: [
      {
        title: "GDPR (EU/EEA)",
        desc: "Articles 5, 6, and 17 for lawful processing and right to erasure.",
      },
      {
        title: "CCPA (United States)",
        desc: "Sections 1798.105–1798.120 for consumer rights and deletion requests.",
      },
      {
        title: "PDPL (UAE)",
        desc: "Federal Decree-Law No. 45 of 2021 governing lawful data handling.",
      },
      {
        title: "DPDP Act (India)",
        desc: "Chapter II (Rights of Data Principals) for retention and deletion obligations.",
      },
    ],
  },
  {
    id: 3,
    title: "Data Controller Identity",
    content: "controller",
    info: [
      { label: "Data Controller", value: "Ride.Rent FZ-LLC" },
      {
        label: "",
        value: "Registered in the UAE with subsidiary operations in India.",
      },
      { label: "Contact", value: "data-compliance@ride.rent", isEmail: true },
    ],
  },
  {
    id: 4,
    title: "What Personal Data We Collect",
    content: "list",
    items: [
      "Identification and contact details (name, phone, email)",
      "Payment and billing data for rental transactions",
      "Supplier verification and business registration data",
      "Device, browser, and activity logs for security monitoring",
      "Location data for service optimization",
      "Communication records and customer support interactions",
    ],
  },
  {
    id: 5,
    title: "How and Why We Process Personal Data",
    content: "numbered",
    intro: "We process data only where necessary to:",
    items: [
      "Deliver rental services and manage customer relationships",
      "Verify supplier identities and ensure contractual compliance",
      "Prevent fraud, misuse, or unauthorized access",
      "Fulfill legal, financial, and regulatory obligations",
      "Improve service quality and user experience",
      "Send important updates and service notifications",
    ],
  },
  {
    id: 6,
    title: "Data Retention and Minimization Principles",
    content:
      "Ride.Rent follows a data minimization principle, ensuring personal data is retained only for the period necessary to fulfill its purpose or as mandated by law. Data is periodically reviewed and securely deleted or anonymized once it becomes redundant.",
  },
  {
    id: 7,
    title: "Global Data Storage and Transfer",
    content:
      "Data is securely stored in ISO 27001–certified cloud infrastructures with data centers in the UAE, EU, and India. Cross-border transfers are performed only under adequate safeguards, including Standard Contractual Clauses (SCCs) and regionally approved mechanisms.",
  },
  {
    id: 8,
    title: "Data Deletion Procedures",
    content: "steps",
    items: [
      "Deletion requests can be initiated by users via their account settings or email",
      "All requests are verified for identity and legitimacy to prevent misuse",
      "Approved requests trigger secure erasure from active databases within 30 days",
      "Confirmation of deletion is provided to the requester via registered email",
      "Complete audit trail maintained for compliance verification",
    ],
  },
  {
    id: 9,
    title: "Backup Retention and Hard Deletion",
    content:
      "Encrypted system backups are retained for up to three years to maintain business continuity and meet compliance obligations. These backups remain segregated, access-restricted, and are subject to irreversible deletion (hard delete) after the retention period expires.",
    highlight: "up to three years",
  },
  {
    id: 10,
    title: "Exceptions to Data Deletion",
    content: "warning",
    intro:
      "Ride.Rent may retain limited data under lawful exceptions, including:",
    items: [
      "Legal or regulatory retention requirements (e.g., tax and accounting)",
      "Pending disputes, fraud investigations, or claims resolution",
      "Historical transactional logs needed for compliance verification",
      "Data required for public health or safety purposes",
      "Archived data for statistical or research purposes",
    ],
  },
  {
    id: 11,
    title: "Rights of Data Subjects",
    content: "checks",
    intro:
      "Under global privacy regulations, individuals have the following rights:",
    items: [
      "Right to access, correct, or update personal data",
      "Right to data portability and restriction of processing",
      "Right to withdraw consent at any time",
      "Right to erasure (Right to be Forgotten)",
      "Right to lodge complaints with relevant authorities",
      "Right to know how data is processed and shared",
      "Right to object to automated decision-making",
      "Right to data minimization and purpose limitation",
    ],
  },
  {
    id: 12,
    title: "Children's Data",
    content:
      "Ride.Rent does not knowingly collect personal data from individuals under the age of 18. If such data is inadvertently collected, it will be deleted immediately upon verification.",
  },
  {
    id: 13,
    title: "Third-Party Sharing and Processors",
    content:
      "We share data only with trusted service providers for hosting, payments, analytics, and marketing. Each processor operates under a strict Data Processing Agreement ensuring confidentiality, limited use, and compliance with global data protection standards.",
  },
  {
    id: 14,
    title: "Security and Access Controls",
    content:
      "Ride.Rent uses multi-layered technical and organizational measures including encryption, intrusion detection, and limited employee access to secure all personal data. Access logs and controls are reviewed periodically by the Data Protection Officer.",
  },
  {
    id: 15,
    title: "Policy Governance and Audits",
    content:
      "Compliance with this policy is monitored through internal audits, external reviews, and vendor assessments. The Ride.Rent Data Protection Office ensures all team members are trained annually in data privacy and security practices.",
  },

  {
    id: 16,
    title: "Contact and Supervisory Authority",
    content: "contact",
    info: [
      { label: "Email", value: "data-compliance@ride.rent", isEmail: true },
      {
        label: "Address",
        value:
          "Ride.Rent/ Data Protection Officer, Shams Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE. License Number: 2434340.",
      },
    ],
  },
];

export default function GlobalDataDeletionPolicy() {
  return (
    <section className="pb-8 sm:pb-12">
      {/* Integrated Page Header - Removed animation props from MotionDiv */}
      <MotionDiv className="mx-auto mb-6 mt-4 max-w-5xl px-4 sm:mb-8 sm:mt-6 sm:px-6 lg:mb-12 lg:mt-8">
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6 shadow-lg sm:rounded-2xl sm:p-8 lg:p-12">
          <MotionH1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-3 text-center text-xl font-bold leading-tight text-white sm:mb-4 sm:text-2xl lg:text-4xl"
          >
            Global Data Deletion & Retention Policy
          </MotionH1>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#F4A51C] to-orange-500 sm:w-24 lg:w-32"></div>
        </div>
      </MotionDiv>

      {/* Hero Banner */}
      <MotionDiv className="mx-auto mb-8 max-w-5xl px-4 sm:mb-12 sm:px-6 lg:mb-20">
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-orange-50 to-blue-50 p-5 sm:rounded-2xl sm:p-6 lg:p-8">
          <p className="text-center text-sm leading-relaxed text-gray-700 sm:text-base lg:text-xl">
            This global policy outlines how Ride.Rent manages, retains,
            transfers, and deletes personal data in line with international
            privacy standards including{" "}
            <strong className="text-[#F4A51C]">GDPR</strong>,{" "}
            <strong className="text-[#F4A51C]">CCPA</strong>,{" "}
            <strong className="text-[#F4A51C]">UAE PDPL</strong>, and{" "}
            <strong className="text-[#F4A51C]">India&apos;s DPDP Act</strong>.
          </p>
        </div>
      </MotionDiv>

      {/* Policy Sections - Reduced badge sizes */}
      <MotionDiv className="mx-auto max-w-5xl space-y-4 px-4 sm:space-y-6 sm:px-6 lg:space-y-8">
        {policyData.map((section) => (
          <div
            key={section.id}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#F4A51C] hover:shadow-md sm:rounded-xl"
          >
            {/* Compact Header with Smaller Badge */}
            <div className="flex items-start gap-0 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              {/* Left Badge Strip - Reduced sizes */}
              <div className="flex w-10 shrink-0 items-center justify-center bg-gradient-to-br from-[#F4A51C] to-orange-500 py-3 sm:w-11 sm:py-4 lg:w-12 lg:py-4">
                <span className="text-base font-bold text-white sm:text-lg lg:text-xl">
                  {section.id}
                </span>
              </div>
              {/* Title */}
              <div className="flex flex-1 items-center px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-4">
                <h2 className="text-base font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#F4A51C] sm:text-lg lg:text-xl">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 text-sm text-gray-700 sm:p-5 lg:p-6 lg:text-base">
              {/* Simple text content */}
              {typeof section.content === "string" &&
                section.content !== "compliance" &&
                section.content !== "controller" &&
                section.content !== "contact" &&
                section.content !== "list" &&
                section.content !== "numbered" &&
                section.content !== "steps" &&
                section.content !== "warning" &&
                section.content !== "checks" && (
                  <p className="leading-relaxed">
                    {section.highlight ? (
                      <>
                        {section.content.split(section.highlight)[0]}
                        <strong className="text-[#F4A51C]">
                          {section.highlight}
                        </strong>
                        {section.content.split(section.highlight)[1]}
                      </>
                    ) : (
                      section.content
                    )}
                  </p>
                )}

              {/* Compliance cards */}
              {section.content === "compliance" && (
                <>
                  <p className="mb-3 leading-relaxed sm:mb-4">
                    Ride.Rent operates in compliance with international privacy
                    laws such as:
                  </p>
                  <div className="mb-3 space-y-2 sm:mb-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                    {(section.items as ComplianceItem[])?.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-[#F4A51C] hover:shadow-sm"
                      >
                        <h4 className="mb-1 text-sm font-bold text-gray-900 sm:text-base">
                          {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-semibold leading-relaxed sm:text-sm">
                    We ensure all personal data processing is fair, lawful, and
                    transparent across jurisdictions.
                  </p>
                </>
              )}

              {/* Info box */}
              {(section.content === "controller" ||
                section.content === "contact") && (
                <div
                  className={`space-y-2 rounded-lg border p-3 sm:space-y-2.5 sm:rounded-xl sm:p-4 ${
                    section.content === "controller"
                      ? "border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
                      : "border-blue-200 bg-gradient-to-r from-blue-50 to-gray-50"
                  }`}
                >
                  {section.info?.map((item, i) => (
                    <p key={i} className="leading-relaxed">
                      {item.label && (
                        <strong className="text-gray-900">{item.label}:</strong>
                      )}{" "}
                      {item.isEmail ? (
                        <a
                          href={`mailto:${item.value}`}
                          className="break-all font-semibold text-[#F4A51C] hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                  ))}
                </div>
              )}

              {/* Simple list */}
              {section.content === "list" && (
                <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                  {(section.items as string[])?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5 transition-all hover:border-[#F4A51C] sm:p-2"
                    >
                      <span className="mt-0.5 text-base text-[#F4A51C] sm:text-sm">
                        ✓
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Numbered list */}
              {section.content === "numbered" && (
                <>
                  {section.intro && (
                    <p className="mb-3 leading-relaxed">{section.intro}</p>
                  )}
                  <div className="space-y-2">
                    {(section.items as string[])?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg bg-blue-50 p-3 transition-all hover:bg-blue-100"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Steps */}
              {section.content === "steps" && (
                <div className="space-y-2">
                  {(section.items as string[])?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 p-3 transition-all hover:border-green-300"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning items */}
              {section.content === "warning" && (
                <>
                  {section.intro && (
                    <p className="mb-3 leading-relaxed">{section.intro}</p>
                  )}
                  <div className="space-y-2">
                    {(section.items as string[])?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg border border-orange-200 bg-orange-50 p-2.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                          !
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Check items */}
              {section.content === "checks" && (
                <>
                  {section.intro && (
                    <p className="mb-3 leading-relaxed">{section.intro}</p>
                  )}
                  <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                    {(section.items as string[])?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 p-2.5"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Contact Footer */}
        <div className="mt-8 rounded-xl bg-gradient-to-br from-gray-900 to-blue-900 p-5 text-white sm:mt-12 sm:rounded-2xl sm:p-6 lg:mt-16 lg:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F4A51C] to-orange-500 sm:mb-4 sm:h-16 sm:w-16 sm:rounded-2xl">
              <svg
                className="h-7 w-7 text-white sm:h-8 sm:w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-bold sm:mb-3 sm:text-xl lg:text-2xl">
              Need Assistance?
            </h3>
            <p className="mx-auto mb-5 max-w-2xl px-2 text-sm leading-relaxed text-gray-300 sm:mb-6 sm:text-base lg:text-lg">
              If you have questions or requests regarding this policy, please
              contact our Data Protection Officer
            </p>
            <a
              href="mailto:data-compliance@ride.rent"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F4A51C] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-500 hover:shadow-lg sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Data Protection Officer
            </a>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
