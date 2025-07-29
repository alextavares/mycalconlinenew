'use client';

import { useState, useEffect } from 'react';

export function useLoadingState(initialDelay: number = 100) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate component initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsReady(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  return { isLoading, isReady, setIsLoading };
}