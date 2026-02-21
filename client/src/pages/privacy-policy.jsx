export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-xl px-8 py-12 md:px-16 md:py-16 text-gray-800">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg px-8 py-6 w-full">
          <h1 className="text-4xl font-extrabold text-white tracking-tight text-center drop-shadow-lg">Privacy Policy</h1>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="font-semibold text-lg text-blue-600">Effective Date:</span>
        <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium border border-gray-300">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-blue-900">
          <span className="font-bold">PulseZest</span> built the <span className="font-bold">PulseZest Employee</span> application as an internal employee-use application. This app is intended strictly for authorized employees of the company.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Employee name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Employee ID</li>
        <li>Device information (model, OS version)</li>
        <li>App usage data and logs</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        2. How We Use Information
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>To authenticate employees</li>
        <li>To manage internal operations</li>
        <li>To improve app functionality</li>
        <li>To maintain security and prevent unauthorized access</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        3. Data Sharing
      </h2>
      <p className="mb-4 text-gray-700">
        We do not sell or rent employee personal data. Data may be shared only:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>With secure internal service providers (e.g., cloud hosting)</li>
        <li>If required by law or legal process</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        4. Data Security
      </h2>
      <p className="mb-6 text-gray-700">
        We implement appropriate technical and organizational measures to protect employee data against unauthorized access, loss, or misuse.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        5. Data Retention
      </h2>
      <p className="mb-6 text-gray-700">
        We retain employee data only as long as necessary for internal business purposes or as required by law.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        6. Children's Privacy
      </h2>
      <p className="mb-6 text-gray-700">
        This application is not intended for children under the age of 13. We do not knowingly collect personal information from children.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        7. Changes to This Policy
      </h2>
      <p className="mb-6 text-gray-700">
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
        8. Contact Us
      </h2>
      <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded mt-2">
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mt-2 font-medium text-blue-700">
          Email: support@pulsezest.com
        </p>
      </div>
      </main>
    </div>
  );
}