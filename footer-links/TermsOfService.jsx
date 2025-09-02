export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        By using our platform, you agree to the following terms and conditions. Please read them carefully.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Service</h2>
      <p className="mb-4">
        You may use our service to read and publish content as long as you comply with our policies and community guidelines.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">User Content</h2>
      <p className="mb-4">
        You are responsible for the content you post. Do not publish anything unlawful, harmful, or misleading.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate our terms or engage in harmful activity.
      </p>
      <p>
        If you have questions, contact us at{" "}
        <a href="mailto:legal@example.com" className="text-blue-600 underline">
          legal@example.com
        </a>.
      </p>
    </main>
  );
}
