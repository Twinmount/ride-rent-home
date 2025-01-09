import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import HeadingBanner from "@/components/general/heading-banner/HeadingBanner";

export async function generateMetadata() {
  const canonicalUrl = `https://ride.rent/privacy-policy`;
  const title = `Privacy Policy - Ride Rent`;
  const description = `Read our privacy policy to learn how  FleetOrbita
 Internet Services/Ride Rent LLC collects, uses, and protects your personal information.`;

  return {
    title,
    description,
    keywords: `privacy policy, data protection, personal information, Ride Rent`,
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

export default function PrivacyPolicy() {
  return (
    <section className="pb-12">
      <HeadingBanner heading="Privacy Policy" />
      <MotionDiv className="mx-auto mt-12 flex w-4/5 flex-col items-center gap-8">
        <h2 className="text-center text-lg font-semibold">
          Privacy Policy for Ride.Rent & Myfleet.rent
        </h2>

        <h3 className="text-2xl font-semibold">Introduction</h3>

        <h4 className="-my-2 text-lg font-semibold">
          <a
            className="text-blue-500 hover:underline"
            href="https://ride.rent"
            target="_blank"
          >
            Ride.Rent
          </a>{" "}
          & it&apos;s sister portal,{" "}
          <a
            className="text-blue-500 hover:underline"
            href="https://myfleet.rent"
          >
            MyFleet.rent
          </a>
          , are brands owned & operated by FleetOrbita Internet Services/Ride
          Rent LLC.
        </h4>

        <p className="text-center">
          <span className="font-bold text-black">
            {" "}
            FleetOrbita Internet Services/Ride Rent LLC
          </span>{" "}
          is dedicated to safeguarding your privacy and is committed to
          protecting the personal information collected from you through our
          website (hereinafter collectively referred to as the “Platform”). This
          Privacy Policy outlines the manner in which we gather and use
          information. By utilizing the services offered on our Platform
          (“Services”), you consent to the terms of this policy. References to
          &apos;we&apos;, &apos;us&apos;, or &apos;our&apos; within this policy
          pertain to{" "}
          <span className="highlight">
            {" "}
            FleetOrbita Internet Services/Ride Rent LLC.
          </span>{" "}
          This Privacy Policy complements any other terms and conditions
          applicable to the Platform. Specific privacy terms provided in any
          documents by us should be read in conjunction with this Privacy
          Policy.
        </p>

        {/* external links section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">External Links</h4>
          <p>
            {" "}
            The website{" "}
            <a
              className="text-blue-500 hover:underline"
              target="_blank"
              href="https://ride.rent"
            >
              ride.rent
            </a>{" "}
            is not responsible for the privacy policies of websites it links to.
            If you provide information to such third parties, different rules
            regarding the collection and use of your personal data may apply.
            Directly contact these entities if you have any questions about
            their use of the information they collect
          </p>
        </div>

        {/* Policy Updates section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">Policy Updates</h4>
          <p>
            The Website Policies and Terms & Conditions may be updated
            periodically to meet the requirements and standards. Therefore,
            customers are encouraged to frequently visit these sections to stay
            informed about changes. Modifications will be effective on the day
            they are posted. <br /> <br />
            We reserve the right to modify or remove portions of this Privacy
            Policy at any time at our discretion. Periodic review of this
            Privacy Policy is recommended to stay updated on any changes. We do
            not make representations about third-party websites that may be
            linked to the Platform.
          </p>
        </div>

        {/* Information Collection  section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">
            Information Collection{" "}
          </h4>
          <p>
            When you use our Services, you may provide us with personal
            information, such as your email address, which we use to keep you
            informed and to provide the Services.
          </p>
        </div>

        {/* Cookies section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">Cookies</h4>
          <p>
            When visiting our Platform, we may place one or more cookies (small
            files stored by your browser to recognize you and store your
            preferences). This helps us improve our Services by personalizing
            the information you may want. If you do not want information
            collected through the use of cookies, your browser allows you to
            deny or accept the use of cookies. Disabling cookies may affect the
            functionality of the Services. We cannot control the use of cookies
            by third parties, and their use is not covered by our Privacy
            Policy.
          </p>
        </div>

        {/*  Personal Information Collection and Use section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">
            Personal Information Collection and Use
          </h4>
          <p className="mb-4">
            To provide services, respond to inquiries, handle requests, or
            improve our offerings, we may collect and process the following
            personal information:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Contact details such as name, email, etc.</li>
            <li>
              Credit/debit card details and personally identifiable information
              will <strong>NOT</strong> be stored, sold, shared, rented, or
              leased to third parties.
            </li>
            <li>Any correspondence with us may be recorded.</li>
            <li>
              We may ask you to complete surveys for research purposes, though
              participation is voluntary.
            </li>
            <li>
              We may use your IP address to diagnose server issues and
              administer our website(s), but it contains no personal information
              about you.
            </li>
          </ul>
        </div>

        {/*   Usage of Personal Information section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">
            Usage of Personal Information
          </h4>
          <p className="mb-4">
            We do not sell, trade, rent, or share personal information for
            marketing purposes without your consent, except as outlined in this
            Privacy Policy. We may use your personal information in the
            following ways:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>To present Platform content effectively.</li>
            <li>
              To provide service information, products, or services as
              requested.
            </li>
            <li>
              To offer information on promotions, goods, or services that may
              interest you.
            </li>
            <li>
              To allow interaction with Facebook through our Platform, provided
              you consent to merging profiles when using the &quot;Facebook
              Login&quot; feature.
            </li>
          </ul>
        </div>

        {/*   Third-Party Disclosure section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">Third-Party Disclosure</h4>
          <p className="mb-4">
            We do not sell, trade, rent, or share personal information for
            marketing purposes without your consent, except as outlined in this
            Privacy Policy. We may use your personal information in the
            following ways:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>To present Platform content effectively.</li>
            <li>
              To provide service information, products, or services as
              requested.
            </li>
            <li>
              To offer information on promotions, goods, or services that may
              interest you.
            </li>
            <li>
              To allow interaction with Facebook through our Platform, provided
              you consent to merging profiles when using the &quot;Facebook
              Login&quot; feature.
            </li>
          </ul>
        </div>

        {/* Data Retention section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">Data Retention</h4>
          <p>
            We retain personal data as long as your account is active or needed
            for services, financial reporting, legal obligations, dispute
            resolution, and agreement enforcement .
          </p>
        </div>

        {/* Communication Preferences section */}
        <div className="mr-auto">
          <h4 className="my-4 text-lg font-semibold">
            Communication Preferences
          </h4>
          <p>
            You may opt out of receiving emails about our Services by following
            the instructions at the bottom of any of our emails.
          </p>
        </div>

        {/* Third-Party Advertisements and Links */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">
            Third-Party Advertisements and Links
          </h2>
          <p>
            Our Platform may include advertisements and links to unrelated
            websites, which may collect personal information. Our Privacy Policy
            does not extend to these third parties, and we recommend reviewing
            their privacy policies before providing personal details.
          </p>
        </div>

        {/* Security */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">Security</h2>
          <p>
            We prioritize the security of your Personal Information and employ
            industry-standard technologies to protect against unauthorized
            access, use, alteration, disclosure, or destruction. However, we
            cannot guarantee complete security and are not responsible for
            unauthorized access due to circumstances beyond our control. We may
            use your information for anti-fraud checks, potentially disclosing
            it to credit reference or fraud prevention agencies.
          </p>
        </div>

        {/* Verification and Review */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">Verification and Review</h2>
          <p>
            To verify or update the details you submitted to{" "}
            <span className="highlight">
              {" "}
              FleetOrbita Internet Services/Ride Rent LLC
            </span>
            , contact us via the provided email address. We may request proof of
            identity for security purposes.
          </p>
        </div>

        {/* Rights under CCPA and GDPR */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">Rights under CCPA and GDPR</h2>
          <p>
            California residents and users subject to GDPR have specific rights
            regarding their personal data. These include the right to access,
            rectify, erase, restrict processing, object to processing, and data
            portability. Requests will be addressed within one month. Contact us
            to exercise these rights.
          </p>
        </div>

        {/* Applicable Law and Jurisdiction */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">
            Applicable Law and Jurisdiction
          </h2>
          <p>
            This policy is governed by the laws of the United Arab Emirates as
            applicable in the Emirate of Dubai. Disputes will be subject to the
            exclusive jurisdiction of the Courts in Dubai.
          </p>
        </div>

        {/* Contact Us  */}
        <div className="mr-auto">
          <h2 className="mb-2 text-lg font-bold">Contact Us</h2>
          <p>
            For queries, complaints, or recommendations about this Policy, or to
            correct or update your personal information, contact us at{" "}
            <a
              className="text-blue-500 hover:underline"
              href="mailto:hello@ride.rent"
            >
              hello@ride.rent
            </a>
          </p>
        </div>
      </MotionDiv>
    </section>
  );
}
