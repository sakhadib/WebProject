
export default function HelpCenter() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="mb-4">
        Welcome to our Help Center. Here you can find answers to the most common questions.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Getting Started</h2>
      <p className="mb-4">
        Learn how to create an account, publish your first article, and connect with readers.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Account Issues</h2>
      <p className="mb-4">
        Need help with login, password reset, or account settings? This section covers it.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Support</h2>
      <p>
        Still need help? Reach out to our support team at{" "}
        <a href="mailto:support@example.com" className="text-blue-600 underline">
          support@example.com
        </a>.
      </p>
    </main>
  );
}
