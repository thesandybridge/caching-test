'use client';

interface RedisArchitectureProps {
  strategy: 'strategy1' | 'strategy2';
}

export function RedisArchitecture({ strategy }: RedisArchitectureProps) {
  if (strategy === 'strategy1') {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-orange-300">
        <h3 className="text-md font-semibold mb-3 text-orange-700">
          Trade-offs with Bulk Fetching
        </h3>
        <div className="space-y-3 text-sm">
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <div className="font-mono text-xs text-orange-900 mb-2">
              {'//'} Fetching entire dataset:
            </div>
            <code className="text-xs text-orange-800 block">
              GET * FROM users  {'//'} Load all data
              <br />
              {'//'} Transfer 46 MB to client
              <br />
              {'//'} Client holds everything in memory
            </code>
          </div>

          <div className="text-xs text-gray-700 space-y-1">
            <div>• <strong>Benefits:</strong> Single request, fast local lookups after initial load</div>
            <div>• <strong>Memory cost:</strong> Client holds entire dataset regardless of usage</div>
            <div>• <strong>Bandwidth cost:</strong> Transfers all data even if only viewing a few users</div>
            <div>• <strong>Scaling limits:</strong> Growth constrained by client memory and network</div>
          </div>

          <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-gray-700">
            <strong>Note:</strong> Redis excels at fast O(1) key lookups, which this approach doesn&apos;t leverage
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-500">
      <h3 className="text-md font-semibold mb-3 text-green-700">
        ✅ Proper Redis Usage
      </h3>
      <div className="space-y-3 text-sm">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <div className="font-mono text-xs text-green-900 mb-2">
            {'//'} Correct approach:
          </div>
          <code className="text-xs text-green-800 block">
            GET user:123  {'//'} O(1) lookup
            <br />
            GET user:456  {'//'} Fast individual access
            <br />
            {'//'} Only fetch what you need
          </code>
        </div>

        <div className="text-xs text-green-700 space-y-1">
          <div>• <strong>Leverages Redis:</strong> Fast O(1) key lookups</div>
          <div>• <strong>Memory efficient:</strong> Client only stores viewed users</div>
          <div>• <strong>Bandwidth optimal:</strong> Downloads only what&apos;s displayed</div>
          <div>• <strong>Infinite scale:</strong> Works with 50k, 500k, or 5M users</div>
        </div>

        <div className="mt-3 p-2 bg-green-100 rounded text-xs">
          <div className="text-green-900 font-semibold mb-1">Bonus Benefits:</div>
          <div className="text-green-800 space-y-1">
            <div>• CDN can cache individual users at edge</div>
            <div>• Parallel requests = faster total load time</div>
            <div>• Stale data affects one user, not entire dataset</div>
          </div>
        </div>
      </div>
    </div>
  );
}
