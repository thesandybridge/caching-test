'use client';

import { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatBytes, getObjectSize } from '@/utils/memory';

interface MemoryDataPoint {
  index: number;
  cacheSize: number;
}

interface MemoryChartProps {
  data: unknown;
  label: string;
  color: string;
}

export function MemoryChart({ data, label, color }: MemoryChartProps) {
  const [memoryData, setMemoryData] = useState<MemoryDataPoint[]>([]);
  const [currentSize, setCurrentSize] = useState<number>(0);
  const counterRef = useRef<number>(0);

  useEffect(() => {
    const updateMemory = () => {
      if (!data) return;

      const size = getObjectSize(data);
      setCurrentSize(size);

      counterRef.current += 1;

      setMemoryData(prev => {
        const newPoint = { index: counterRef.current, cacheSize: size };
        const newData = [...prev, newPoint];
        // Keep only last 30 data points
        return newData.slice(-30);
      });
    };

    updateMemory();
    const interval = setInterval(updateMemory, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Cache Memory Usage
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current cache size:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatBytes(currentSize)}
          </span>
        </div>
      </div>

      {memoryData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          No data cached yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={memoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="index"
              tick={{ fontSize: 10 }}
              label={{ value: 'Updates', position: 'insideBottom', offset: -5, fontSize: 11 }}
              height={40}
            />
            <YAxis
              tickFormatter={(value) => formatBytes(value)}
              tick={{ fontSize: 10 }}
              width={70}
            />
            <Tooltip
              formatter={(value: number) => formatBytes(value)}
              labelFormatter={(label) => `Update #${label}`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="cacheSize"
              stroke={color}
              strokeWidth={2}
              name={label}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
