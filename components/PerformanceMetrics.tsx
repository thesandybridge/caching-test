'use client';

import { useRef, useEffect, useState } from 'react';

interface PerformanceMetricsProps {
  apiCallCount: number;
  totalDataTransferred: number;
  initialLoadTime?: number;
  color: string;
}

export function PerformanceMetrics({
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
      <h3 className="text-md font-semibold mb-3 text-gray-800">
        Performance Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-600 text-xs">API Calls</div>
          <div className="font-bold text-lg text-gray-900">
            {apiCallCount.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-600 text-xs">Data Transferred</div>
          <div className="font-bold text-lg text-gray-900">
            {formatBytes(totalDataTransferred)}
          </div>
        </div>
        {initialLoadTime !== undefined && (
          <div>
            <div className="text-gray-600 text-xs">Initial Load Time</div>
            <div className="font-bold text-lg text-gray-900">
              {initialLoadTime.toFixed(0)}ms
            </div>
          </div>
        )}
        <div>
          <div className="text-gray-600 text-xs">Component Renders</div>
          <div className="font-bold text-lg text-gray-900">
            {isClient ? renderCountRef.current : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
