import './PrivacyPolicy.scss'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'

export default function PrivacyPolicy() {
  return (
    <section className="privacy-section">
      <HeadingBanner heading="Privacy Policy" />
      <MotionDiv className="container">
        <h2 className="text-lg font-semibold text-center">
          Privacy Policy for{' '}
          <span className="highlight">
            RideRent Automobile Aggregators L.L.C
          </span>{' '}
          doing business as{' '}
          <a className="highlight" target="_blank" href="https://ride.rent.com">
            https://ride.rent.com
          </a>{' '}
          and{' '}
          <a className="highlight" target="_blank" href="https://ride.rent.com">
            https://myfleet.rent.com
          </a>
        </h2>

        <h3 className="text-2xl font-semibold">Introduction</h3>
        <p className="text-center">
          <span className="highlight">
            RideRent Automobile Aggregators L.L.C
          </span>{' '}
          is dedicated to safeguarding your privacy and is committed to
          protecting the personal information collected from you through our
          website (hereinafter collectively referred to as the “Platform”). This
          Privacy Policy outlines the manner in which we gather and use
          information. By utilizing the services offered on our Platform
          (“Services”), you consent to the terms of this policy. References to
          &apos;we&apos;, &apos;us&apos;, or &apos;our&apos; within this policy
          pertain to{' '}
          <span className="highlight">
            RideRent Automobile Aggregators L.L.C.
          </span>{' '}
          This Privacy Policy complements any other terms and conditions
          applicable to the Platform. Specific privacy terms provided in any
          documents by us should be read in conjunction with this Privacy
          Policy.
        </p>

        {/* external links section */}
        <div className="mr-auto">
          <h4 className="text-lg font-semibold my-4 ">External Links</h4>
          <p>
            {' '}
            The website{' '}
            <a
              className="highlight"
              target="_blank"
              href="https://ride.rent.com"
            >
              https://ride.rent.com
            </a>{' '}
            is not responsible for the privacy policies of websites it links to.
            If you provide information to such third parties, different rules
            regarding the collection and use of your personal data may apply.
            Directly contact these entities if you have any questions about
            their use of the information they collect
          </p>
        </div>

        {/* Policy Updates section */}
        <div className="mr-auto">
          <h4 className="text-lg font-semibold my-4 ">Policy Updates</h4>
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
          <h4 className="text-lg font-semibold my-4 ">
            Information Collection{' '}
          </h4>
          <p>
            When you use our Services, you may provide us with personal
            information, such as your email address, which we use to keep you
            informed and to provide the Services.
          </p>
        </div>

        {/* Cookies section */}
        <div className="mr-auto">
          <h4 className="text-lg font-semibold my-4 ">Cookies</h4>
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
          <h4 className="text-lg font-semibold my-4 ">
            Personal Information Collection and Use
          </h4>
          <p className="mb-4">
            To provide services, respond to inquiries, handle requests, or
            improve our offerings, we may collect and process the following
            personal information:
          </p>
          <ul className="list-disc list-inside space-y-2">
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
          <h4 className="text-lg font-semibold my-4 ">
            Usage of Personal Information
          </h4>
          <p className="mb-4">
            We do not sell, trade, rent, or share personal information for
            marketing purposes without your consent, except as outlined in this
            Privacy Policy. We may use your personal information in the
            following ways:
          </p>
          <ul className="list-disc list-inside space-y-2">
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
          <h4 className="text-lg font-semibold my-4 ">
            Third-Party Disclosure
          </h4>
          <p className="mb-4">
            We do not sell, trade, rent, or share personal information for
            marketing purposes without your consent, except as outlined in this
            Privacy Policy. We may use your personal information in the
            following ways:
          </p>
          <ul className="list-disc list-inside space-y-2">
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
          <h4 className="text-lg font-semibold my-4 ">Data Retention</h4>
          <p>
            We retain personal data as long as your account is active or needed
            for services, financial reporting, legal obligations, dispute
            resolution, and agreement enforcement .
          </p>
        </div>

        {/* Communication Preferences section */}
        <div className="mr-auto">
          <h4 className="text-lg font-semibold my-4 ">
            Communication Preferences
          </h4>
          <p>
            You may opt out of receiving emails about our Services by following
            the instructions at the bottom of any of our emails.
          </p>
        </div>

        {/* Third-Party Advertisements and Links */}
        <div className="mr-auto">
          <h2 className="font-bold text-lg mb-2">
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
          <h2 className="font-bold text-lg mb-2">Security</h2>
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
          <h2 className="font-bold text-lg mb-2">Verification and Review</h2>
          <p>
            To verify or update the details you submitted to{' '}
            <span className="highlight">
              RideRent Automobile Aggregators L.L.C
            </span>
            , contact us via the provided email address. We may request proof of
            identity for security purposes.
          </p>
        </div>

        {/* Rights under CCPA and GDPR */}
        <div className="mr-auto">
          <h2 className="font-bold text-lg mb-2">Rights under CCPA and GDPR</h2>
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
          <h2 className="font-bold text-lg mb-2">
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
          <h2 className="font-bold text-lg mb-2">Contact Us</h2>
          <p>
            For queries, complaints, or recommendations about this Policy, or to
            correct or update your personal information, contact us at
            info@ride.rent.
          </p>
        </div>
      </MotionDiv>
    </section>
  )
}
