"use client";

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Application Error</h1>

            <p className="mt-2 text-gray-500">Please refresh the page.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
