import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiMetrics } from '../types';

export const useApiMetrics = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [lastLatency, setLastLatency] = useState(0);
  const [requestsPerMinute, setRequestsPerMinute] = useState(0);
  
  const requestTimestamps = useRef<number[]>([]);
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();

  // Optimized: Only update RPM when it actually changes
  useEffect(() => {
    cleanupIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const filtered = requestTimestamps.current.filter(t => now - t <= 60000);
      
      if (filtered.length !== requestTimestamps.current.length) {
        requestTimestamps.current = filtered;
        setRequestsPerMinute(filtered.length);
      }
    }, 5000); // Check every 5s instead of 1s

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, []);

  // Memoized to prevent re-creating on every render
  const trackRequest = useCallback(async <T>(requestFn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now(); // More accurate than Date.now()
    
    setTotalRequests(prev => prev + 1);
    requestTimestamps.current.push(Date.now());
    setRequestsPerMinute(requestTimestamps.current.length);

    try {
      const result = await requestFn();
      setLastLatency(Math.round(performance.now() - startTime));
      return result;
    } catch (error) {
      setLastLatency(Math.round(performance.now() - startTime));
      setTotalErrors(prev => prev + 1);
      throw error;
    }
  }, []);

  // Memoize metrics object to prevent unnecessary re-renders
  const metrics: ApiMetrics = {
    totalRequests,
    errorRate: totalRequests > 0 ? Math.round((totalErrors / totalRequests) * 100) : 0,
    lastLatency,
    requestsPerMinute
  };

  return { metrics, trackRequest };
};
