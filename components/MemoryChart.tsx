'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatBytes, getObjectSize } from '@/utils/memory';

interface MemoryDataPoint {
  time: string;
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

  useEffect(() => {
    const updateMemory = () => {
      if (data) {
        const size = getObjectSize(data);
        setCurrentSize(size);

        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        setMemoryData(prev => {
          const newData = [...prev, { time: timeStr, cacheSize: size }];
          // Keep only last 20 data points
          return newData.slice(-20);
        });
      }
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
          <span className="text-lg font-bold" style={{ color }}>
            {formatBytes(currentSize)}
          </span>
        </div>
      </div>

      {memoryData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={memoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(value) => formatBytes(value)}
              tick={{ fontSize: 10 }}
              width={60}
            />
            <Tooltip
              formatter={(value: number) => formatBytes(value)}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cacheSize"
              stroke={color}
              strokeWidth={2}
              name={label}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {memoryData.length === 0 && (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          No data cached yet
        </div>
      )}
    </div>
  );
}
