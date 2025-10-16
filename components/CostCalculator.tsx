'use client';

import { useState } from 'react';
import { formatBytes } from '@/utils/memory';

interface CostCalculatorProps {
  strategy: 'strategy1' | 'strategy2';
  dataSize: number; // bytes per request
  color: string;
}

export function CostCalculator({ strategy, dataSize, color }: CostCalculatorProps) {
  const [dailyUsers, setDailyUsers] = useState(1000);
  const [avgUsersViewed, setAvgUsersViewed] = useState(50);

  // AWS Data Transfer pricing (2025 rates)
  const awsDataTransferCost = 0.09; // $0.09 per GB (first 10TB)
  const cloudFrontCost = 0.085; // $0.085 per GB (US/EU regions)
  const apiGatewayRestCost = 3.50; // $3.50 per million requests (REST API)
  const apiGatewayHttpCost = 1.00; // $1.00 per million requests (HTTP API)

  const calculateCosts = () => {
    let monthlyDataTransfer: number;
    let monthlyRequests: number;

    if (strategy === 'strategy1') {
      // Every user downloads the full dataset
      monthlyDataTransfer = dataSize * dailyUsers * 30;
      monthlyRequests = dailyUsers * 30; // One big request per user
    } else {
      // Users only download what they view
      const avgUserSize = avgUsersViewed * 1000; // Approximate 1KB per user
      monthlyDataTransfer = avgUserSize * dailyUsers * 30;
      monthlyRequests = avgUsersViewed * dailyUsers * 30; // Individual requests
    }

    const dataTransferGB = monthlyDataTransfer / (1024 * 1024 * 1024);
    const dataTransferCost = dataTransferGB * awsDataTransferCost;
    const cdnCost = dataTransferGB * cloudFrontCost;

    // API Gateway costs (using REST API pricing as more common)
    const requestCost = (monthlyRequests / 1000000) * apiGatewayRestCost;

    // Total costs
    const awsCost = dataTransferCost + requestCost;
    const totalCdnCost = cdnCost + requestCost;

    return {
      monthlyDataTransfer,
      monthlyRequests,
      dataTransferCost,
      requestCost,
      awsCost,
      cdnCost,
      totalCdnCost,
      dataTransferGB
    };
  };

  const costs = calculateCosts();

  // Calculate Strategy 2 costs for comparison
  const strategy2DataTransfer = (avgUsersViewed * 1000 * dailyUsers * 30) / (1024 * 1024 * 1024);
  const strategy2DataCost = strategy2DataTransfer * awsDataTransferCost;
  const strategy2Requests = avgUsersViewed * dailyUsers * 30;
  const strategy2RequestCost = (strategy2Requests / 1000000) * apiGatewayRestCost;
  const strategy2Cost = strategy2DataCost + strategy2RequestCost;

  // Calculate savings
  const savingsPercent = strategy === 'strategy1'
    ? ((costs.awsCost - strategy2Cost) / costs.awsCost * 100)
    : 0;

  if (!dataSize || dataSize === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border-2" style={{ borderColor: color }}>
        <h3 className="text-md font-semibold mb-3 text-gray-800">
          AWS Bandwidth Costs
        </h3>
        <div className="text-sm text-gray-500 text-center py-8">
          Loading data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-2" style={{ borderColor: color }}>
      <h3 className="text-md font-semibold mb-3 text-gray-800">
        AWS Bandwidth Costs
      </h3>

      <div className="bg-gray-50 rounded p-2 mb-4 border border-gray-200">
        <div className="text-xs font-semibold text-gray-700 mb-1">AWS Pricing (2025 Rates)</div>
        <div className="text-xs text-gray-600 space-y-0.5">
          <div>• Data Transfer Out: <span className="font-mono font-semibold">${awsDataTransferCost.toFixed(2)}/GB</span> (first 10TB)</div>
          <div>• CloudFront CDN: <span className="font-mono font-semibold">${cloudFrontCost.toFixed(3)}/GB</span> (US/EU)</div>
          <div>• API Gateway REST: <span className="font-mono font-semibold">${apiGatewayRestCost.toFixed(2)}/million</span></div>
          <div>• API Gateway HTTP: <span className="font-mono font-semibold">${apiGatewayHttpCost.toFixed(2)}/million</span></div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-gray-700 font-medium block mb-1">Daily Active Users</label>
          <input
            type="number"
            value={dailyUsers}
            onChange={(e) => setDailyUsers(Math.max(1, parseInt(e.target.value) || 1000))}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
            min="1"
          />
        </div>

        {strategy === 'strategy2' && (
          <div>
            <label className="text-xs text-gray-700 font-medium block mb-1">Avg Users Viewed per Session</label>
            <input
              type="number"
              value={avgUsersViewed}
              onChange={(e) => setAvgUsersViewed(Math.max(1, parseInt(e.target.value) || 50))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
              min="1"
              max="1000"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-700">Monthly Data Transfer</span>
          <span className="font-semibold text-gray-900">{formatBytes(costs.monthlyDataTransfer)}</span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-700">Monthly API Requests</span>
          <span className="font-semibold text-gray-900">{costs.monthlyRequests.toLocaleString()}</span>
        </div>

        <div className="bg-gray-50 rounded p-2 space-y-1 mb-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Data Transfer Cost</span>
            <span className="font-mono text-gray-900">${costs.dataTransferCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">API Request Cost</span>
            <span className="font-mono text-gray-900">${costs.requestCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-gray-700 font-semibold">Total AWS Cost</span>
          <span className="font-semibold text-lg text-gray-900">
            ${costs.awsCost.toFixed(2)}/mo
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-xs">With CloudFront CDN</span>
          <span className="font-semibold text-gray-900">
            ${costs.totalCdnCost.toFixed(2)}/mo
          </span>
        </div>

        {strategy === 'strategy1' && savingsPercent > 0 && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <div className="text-xs text-red-800 font-semibold">
              ⚠️ Wasted Bandwidth
            </div>
            <div className="text-xs text-red-600 mt-1">
              Strategy 2 would save ~${(costs.awsCost - strategy2Cost).toFixed(2)}/mo
              <span className="font-semibold"> ({savingsPercent.toFixed(0)}% savings)</span>
            </div>
          </div>
        )}

        {strategy === 'strategy2' && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-green-800 font-semibold">
              ✅ Efficient Usage
            </div>
            <div className="text-xs text-green-600 mt-1">
              Only pay for data users actually view
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
