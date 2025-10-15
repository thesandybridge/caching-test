// Utility to calculate the approximate size of an object in bytes
export function getObjectSize(obj: unknown): number {
  const str = JSON.stringify(obj);
  return new Blob([str]).size;
}

// Format bytes to human readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Chrome-specific performance.memory API
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

// Get browser memory usage if available (Chrome only)
export function getBrowserMemory(): number | null {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perf = performance as PerformanceWithMemory;
    if (perf.memory && perf.memory.usedJSHeapSize) {
      return perf.memory.usedJSHeapSize;
    }
  }
  return null;
}
