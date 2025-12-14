import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiMetrics } from '../types';

export const useApiMetrics = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [lastLatency, setLastLatency] = useState(0);
  const [requestsPerMinute, setRequestsPerMinute] = useState(0);
  
  // Store timestamps of requests from the last 60 seconds
  const requestTimestamps = useRef<number[]>([]);

  // Periodically clean up old timestamps to keep RPM "live"
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const prevLength = requestTimestamps.current.length;
      requestTimestamps.current = requestTimestamps.current.filter(t => now - t <= 60000);
      
      // Only trigger re-render if count changed
      if (requestTimestamps.current.length !== prevLength) {
        setRequestsPerMinute(requestTimestamps.current.length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const trackRequest = useCallback(async <T>(requestFn: () => Promise<T>): Promise<T> => {
    const startTime = Date.now();
    
    // Optimistic updates
    setTotalRequests(prev => prev + 1);
    requestTimestamps.current.push(startTime);
    setRequestsPerMinute(requestTimestamps.current.length);

    try {
      const result = await requestFn();
      const endTime = Date.now();
      setLastLatency(endTime - startTime);
      return result;
    } catch (error) {
      const endTime = Date.now();
      setLastLatency(endTime - startTime);
      setTotalErrors(prev => prev + 1);
      throw error;
    }
  }, []);

  const metrics: ApiMetrics = {
    totalRequests,
    errorRate: totalRequests > 0 ? Math.round((totalErrors / totalRequests) * 100) : 0,
    lastLatency,
    requestsPerMinute
  };

  return { metrics, trackRequest };
};