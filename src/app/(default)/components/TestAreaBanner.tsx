'use client'
/*
  This component displays a notice directing new users to the official Test Area
  to prevent test data from being scattered across unrelated locations.
*/
export const TestAreaBanner: React.FC = () => {
  return (
    <section className="default-page-margins flex flex-col justify-center w-fit my-6">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-1">🧪 New here?</h2>
        <p className="text-sm">
          Try using our{' '}
          <a
            href="/areas/18c5dd5c-8186-50b6-8a60-ae2948c548d1/test-area"
            className="text-blue-600 underline"
          >
            Test Area
          </a>{' '}
          before adding real routes. This helps keep the map clean for everyone and helps keep things tidy!
        </p>
      </div>
    </section>
  )
}