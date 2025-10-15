'use client';

import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';
import { useState } from 'react';
import { MemoryChart } from './MemoryChart';

// UserCard component that receives user data from parent's cache
function UserCard({ user }: { user: User }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}

export function Strategy1() {
  const [showUsers, setShowUsers] = useState(false);
  const [userCount, setUserCount] = useState(50);

  // Fetch all users upfront
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      console.log('🔵 Strategy 1: Fetching ALL users...');
      const startTime = performance.now();
      const response = await fetch('/api/users');
      const data = await response.json();
      const endTime = performance.now();
      console.log(`🔵 Strategy 1: Fetched ${data.users.length} users in ${(endTime - startTime).toFixed(2)}ms`);
      return data;
    },
    staleTime: Infinity, // Keep data fresh indefinitely
  });

  const displayedUserIds = Array.from({ length: userCount }, (_, i) => i + 1);

  return (
    <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Strategy 1: Fetch All Users Upfront
        </h2>
        <p className="text-sm text-blue-700 mb-4">
          Loads entire user dataset once, then individual cards read from that cached data.
        </p>

        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`text-sm font-semibold ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
              {isLoading ? 'Loading...' : `${data?.users.length.toLocaleString()} users cached`}
            </span>
          </div>
          {data && (
            <div className="text-xs text-gray-500">
              Initial fetch time: {data.meta.fetchTime}ms
            </div>
          )}
        </div>

        <MemoryChart data={data} label="All Users Cache" color="#2563eb" />

        <div className="flex items-center gap-4 mb-4 mt-4">
          <label className="text-sm font-medium text-gray-700">
            Number of cards to display:
          </label>
          <input
            type="number"
            value={userCount}
            onChange={(e) => setUserCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 50)))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm w-24"
            min="1"
            max="1000"
          />
        </div>

        <button
          onClick={() => setShowUsers(!showUsers)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 p-4 bg-red-50 rounded-lg mb-4">
          Error: {error.message}
        </div>
      )}

      {showUsers && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedUserIds.map(userId => {
            const user = data.users.find(u => u.id === userId);
            return user ? <UserCard key={userId} user={user} /> : null;
          })}
        </div>
      )}
    </div>
  );
}
