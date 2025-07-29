'use client';

import { Suspense } from 'react';
import { Icons } from '@/components/icons';

interface CalculatorSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-xl p-6 shadow-md border">
        {/* Animated loading header */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Icons.math className="w-12 h-12 text-purple-600 animate-pulse" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Inicializando calculadora</h3>
          <p className="text-sm text-gray-500">Carregando componentes...</p>
        </div>
        
        {/* Animated skeleton form */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 bg-gray-200 rounded animate-pulse w-${20 + i * 8}`}></div>
              <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
          
          <div className="pt-4">
            <div className="h-10 bg-purple-100 rounded animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Quase pronto...</p>
        </div>
      </div>
    </div>
  </div>
);

export function CalculatorSuspense({ children, fallback }: CalculatorSuspenseProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
}