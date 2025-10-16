'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { MemoryChart } from './MemoryChart';
import { PerformanceMetrics } from './PerformanceMetrics';
import { CostCalculator } from './CostCalculator';
import { MobileWarning } from './MobileWarning';
import { RedisArchitecture } from './RedisArchitecture';
import Image from 'next/image';
import { getObjectSize } from '@/utils/memory';

// UserCard component that fetches its own data by ID
function UserCard({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log(`🟢 Strategy 2: Fetching user ${userId}...`);
      const startTime = performance.now();
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      const endTime = performance.now();
      console.log(`🟢 Strategy 2: Fetched user ${userId} in ${(endTime - startTime).toFixed(2)}ms`);
      return data;
    },
    staleTime: Infinity, // Keep data fresh indefinitely
  });

  if (isLoading) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="border border-red-300 rounded-lg p-4 bg-red-50">
        <p className="text-red-600 text-sm">Error loading user {userId}</p>
      </div>
    );
  }

  const user = data.user;

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <Image
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
          width={48}
          height={48}
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

interface CachedData {
  users: unknown[];
}

export function Strategy2() {
  const [showUsers, setShowUsers] = useState(false);
  const [userCount, setUserCount] = useState(50);
  const [cachedData, setCachedData] = useState<CachedData | null>(null);
  const queryClient = useQueryClient();

  const displayedUserIds = Array.from({ length: userCount }, (_, i) => i + 1);

  // Subscribe to query cache changes
  useEffect(() => {
    const updateCachedData = () => {
      const cache = queryClient.getQueryCache();
      const allQueries = cache.getAll();

      // Filter for user queries only (those with queryKey starting with 'user')
      const userQueries = allQueries.filter(query =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'user'
      );

      // Extract the cached user data
      const users = userQueries
        .map(query => query.state.data as { user?: unknown })
        .filter(data => data && data.user);

      // Defer state update to avoid updating during render
      setTimeout(() => {
        setCachedData(prev => {
          // Only update if the length changed to reduce re-renders
          if (prev?.users?.length !== users.length) {
            return { users };
          }
          return prev;
        });
      }, 0);
    };

    updateCachedData();

    // Subscribe to cache updates instead of polling
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      updateCachedData();
    });

    return () => unsubscribe();
  }, [queryClient]);

  return (
    <div className="border-2 border-green-500 rounded-xl p-6 bg-green-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Strategy 2: Fetch Individually by ID
        </h2>
        <p className="text-sm text-green-700 mb-4">
          Fetches users on-demand as needed. Better suited for large datasets and bandwidth efficiency.
        </p>

        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Approach:</span>
            <span className="text-sm text-gray-600">
              Individual API calls per user (batched by React Query)
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Each user is cached independently with key: [&apos;user&apos;, id]
          </div>
          <div className="text-xs text-gray-600 font-semibold">
            Currently cached: {cachedData?.users?.length || 0} users
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <MemoryChart data={cachedData} label="Individual User Caches" color="#16a34a" />
          <PerformanceMetrics
            apiCallCount={cachedData?.users?.length || 0}
            totalDataTransferred={cachedData ? getObjectSize(cachedData) : 0}
            color="#16a34a"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <CostCalculator
            strategy="strategy2"
            dataSize={cachedData ? getObjectSize(cachedData) : 0}
            color="#16a34a"
          />
          <RedisArchitecture strategy="strategy2" />
        </div>

        <div className="mb-4">
          <MobileWarning
            dataSize={cachedData ? getObjectSize(cachedData) : 0}
            strategy="strategy2"
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">
            Number of cards to display:
          </label>
          <input
            type="number"
            value={userCount}
            onChange={(e) => setUserCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 50)))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm w-24 text-gray-900 bg-white"
            min="1"
            max="1000"
          />
        </div>

        <button
          onClick={() => setShowUsers(!showUsers)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
      </div>

      {showUsers && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedUserIds.map(userId => (
            <UserCard key={userId} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
