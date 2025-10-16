'use client';

interface MobileWarningProps {
  dataSize: number; // in bytes
  strategy: 'strategy1' | 'strategy2';
}

export function MobileWarning({ dataSize, strategy }: MobileWarningProps) {
  const dataSizeMB = dataSize / (1024 * 1024);

  // Mobile network speeds (approximate)
  const networks = {
    '2G': { speed: 0.25, label: '2G (250 Kbps)' }, // 250 Kbps
    '3G': { speed: 1.5, label: '3G (1.5 Mbps)' },  // 1.5 Mbps
    'Slow 4G': { speed: 5, label: 'Slow 4G (5 Mbps)' },   // 5 Mbps
    '4G': { speed: 15, label: '4G (15 Mbps)' },    // 15 Mbps
    'WiFi': { speed: 50, label: 'WiFi (50 Mbps)' }  // 50 Mbps
  };

  const calculateLoadTime = (speedMbps: number) => {
    const timeInSeconds = (dataSizeMB * 8) / speedMbps; // Convert MB to Mbits, divide by speed
    if (timeInSeconds < 1) return `${(timeInSeconds * 1000).toFixed(0)}ms`;
    if (timeInSeconds < 60) return `${timeInSeconds.toFixed(1)}s`;
    return `${(timeInSeconds / 60).toFixed(1)}min`;
  };

  if (strategy === 'strategy2') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="text-green-600 text-xl">✓</div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Mobile-Friendly</h4>
            <p className="text-xs text-green-700">
              Progressive loading - users see content immediately. Only downloads what they view (~50KB typical).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-2 mb-3">
        <div className="text-red-600 text-xl">⚠️</div>
        <div>
          <h4 className="font-semibold text-red-900 mb-1">Mobile User Experience</h4>
          <p className="text-xs text-red-700 mb-2">
            {dataSizeMB.toFixed(1)} MB must download before users see ANYTHING. Blocking load times:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries(networks).map(([key, { speed, label }]) => {
          const time = calculateLoadTime(speed);
          const isSlow = parseFloat(time) > 5 || time.includes('min');

          return (
            <div
              key={key}
              className={`p-2 rounded ${isSlow ? 'bg-red-100 border border-red-300' : 'bg-yellow-50 border border-yellow-200'}`}
            >
              <div className="font-semibold text-gray-800">{label}</div>
              <div className={`text-lg font-bold ${isSlow ? 'text-red-700' : 'text-yellow-700'}`}>
                {time}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800">
        <strong>💸 User Impact:</strong> On mobile data plans, this could cost users $1-5 in data charges
      </div>
    </div>
  );
}
