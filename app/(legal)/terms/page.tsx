import { LegalLayout } from "@/components/legal-layout"

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" description="Please read these terms carefully before using Memoria.">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Memoria, the digital yearbook platform for Consolatrix College of Toledo City, Inc. These Terms
            of Service ("Terms") govern your use of our website and services. By accessing or using Memoria, you agree
            to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">As a user of Memoria, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide accurate and truthful information during registration</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Use the platform respectfully and in accordance with school policies</li>
            <li>Not share inappropriate content or engage in harmful behavior</li>
            <li>Respect the privacy and rights of other users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
          <p className="text-gray-700 leading-relaxed">
            To access Memoria, you must create an account using your valid school credentials. You are responsible for
            maintaining the security of your account and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content and Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content on Memoria, including photos, text, and design elements, is the property of Consolatrix College
            of Toledo City, Inc. or its licensors. Users may view and download content for personal, non-commercial use
            only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and
            protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Activities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">The following activities are strictly prohibited:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Unauthorized access to other users' accounts</li>
            <li>Uploading malicious software or harmful content</li>
            <li>Harassment, bullying, or discriminatory behavior</li>
            <li>Commercial use of the platform without permission</li>
            <li>Violation of applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Memoria is provided "as is" without warranties of any kind. Consolatrix College of Toledo City, Inc. shall
            not be liable for any damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. Users will be notified of significant changes, and
            continued use of the platform constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Consolatrix College of Toledo City, Inc.</strong>
              <br />
              Email: info@consolatrix.edu.ph
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
