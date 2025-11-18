'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold text-red-600">Error</h1>
            <h2 className="mb-4 text-2xl font-semibold">Something went wrong!</h2>
            <p className="mb-8 text-gray-600">
              We&apos;re sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => reset()}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
