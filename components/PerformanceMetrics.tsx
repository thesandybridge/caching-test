'use client';

import { useRef, useEffect, useState } from 'react';

interface PerformanceMetricsProps {
  strategy: 'strategy1' | 'strategy2';
  apiCallCount: number;
  totalDataTransferred: number;
  initialLoadTime?: number;
  color: string;
}

export function PerformanceMetrics({
  strategy,
  apiCallCount,
  totalDataTransferred,
  initialLoadTime,
  color
}: PerformanceMetricsProps) {
  const renderCountRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient) {
    renderCountRef.current += 1;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-2" style={{ borderColor: color }}>
      <h3 className="text-md font-semibold mb-3" style={{ color }}>
        Performance Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-500 text-xs">API Calls</div>
          <div className="font-bold text-lg" style={{ color }}>
            {apiCallCount.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Data Transferred</div>
          <div className="font-bold text-lg" style={{ color }}>
            {formatBytes(totalDataTransferred)}
          </div>
        </div>
        {initialLoadTime !== undefined && (
          <div>
            <div className="text-gray-500 text-xs">Initial Load Time</div>
            <div className="font-bold text-lg" style={{ color }}>
              {initialLoadTime.toFixed(0)}ms
            </div>
          </div>
        )}
        <div>
          <div className="text-gray-500 text-xs">Component Renders</div>
          <div className="font-bold text-lg" style={{ color }}>
            {isClient ? renderCountRef.current : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
