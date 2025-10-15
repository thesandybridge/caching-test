import { Strategy1 } from '@/components/Strategy1';
import { Strategy2 } from '@/components/Strategy2';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            React Query Caching Strategies Comparison
          </h1>
          <p className="text-gray-600">
            Comparing two approaches to caching user data with React Query.
            Open the browser console to see API calls being made.
          </p>
        </header>

        <div className="space-y-8">
          <Strategy1 />
          <Strategy2 />
        </div>

        <footer className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-3">Key Differences:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Strategy 1: Fetch All Upfront</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Single large API call (~1.5MB payload)</li>
                <li>All data cached under one key: [&apos;all-users&apos;]</li>
                <li>User cards read from shared cache</li>
                <li>Fast subsequent renders (no loading states)</li>
                <li>Higher initial load time</li>
                <li>Memory: All 10,000 users in memory</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Strategy 2: Fetch Individually</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Multiple small API calls (per user ID)</li>
                <li>Each user cached separately: [&apos;user&apos;, id]</li>
                <li>Parallel fetching for visible cards</li>
                <li>Staggered loading states</li>
                <li>Lower initial load time</li>
                <li>Memory: Only fetched users in memory</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
