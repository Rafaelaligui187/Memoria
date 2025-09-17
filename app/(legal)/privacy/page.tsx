import { LegalLayout } from "@/components/legal-layout"

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" description="Learn how we collect, use, and protect your personal information.">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create an account, update your profile,
            or contact us for support.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>School ID number</li>
            <li>Full name</li>
            <li>Email address</li>
            <li>Role (student, teacher, alumni)</li>
            <li>Profile information and photos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and maintain the Memoria platform</li>
            <li>Authenticate your identity and manage your account</li>
            <li>Display your information in the digital yearbook</li>
            <li>Send important updates and notifications</li>
            <li>Improve our services and user experience</li>
            <li>Ensure platform security and prevent misuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>With other users as part of the yearbook functionality</li>
            <li>With school administrators for educational purposes</li>
            <li>When required by law or to protect our rights</li>
            <li>With service providers who assist in platform operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information for as long as your account is active or as needed to provide services.
            We may retain certain information for legitimate business purposes or as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
          <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of non-essential communications</li>
            <li>Request a copy of your personal data</li>
            <li>Report privacy concerns to school administrators</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze
            platform usage. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Memoria is designed for use by students, faculty, and alumni of Consolatrix College. We take special care to
            protect the privacy of younger users and comply with applicable privacy laws regarding minors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify users of significant changes by posting
            the updated policy on our platform and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Privacy Officer</strong>
              <br />
              Consolatrix College of Toledo City, Inc.
              <br />
              Email: privacy@consolatrix.edu.ph
              <br />
              Phone: (032) 123-4567
              <br />
              Address: Toledo City, Cebu, Philippines
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </LegalLayout>
  )
}
