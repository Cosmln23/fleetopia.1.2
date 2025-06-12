'use client';

// import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry.captureException(error);
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 rounded-lg border border-gray-800 p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
              <p className="text-gray-400 text-sm mb-4">
                An unexpected error occurred. Our team has been notified and is working on a fix.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mb-4">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact support at{' '}
                <a href="mailto:support@fleetopia.co" className="text-blue-400 hover:text-blue-300">
                  support@fleetopia.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 