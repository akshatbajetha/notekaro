export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            A sign in link has been sent to your email address.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            If you don&apos;t see it, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}
