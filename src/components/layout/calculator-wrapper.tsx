'use client';

import { useEffect, useState } from 'react';
import { useLoadingState } from '@/hooks/use-loading-state';
import { Icons } from '@/components/icons';

interface CalculatorWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function CalculatorWrapper({ children, title, className = "" }: CalculatorWrapperProps) {
  const { isLoading, isReady } = useLoadingState(200);

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center min-h-screen p-4 bg-gray-50 ${className}`}>
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl p-6 shadow-md border">
            {/* Animated loading header */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <Icons.math className="w-12 h-12 text-purple-600 animate-pulse" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                {title ? `Carregando ${title}` : 'Carregando calculadora'}
              </h3>
              <p className="text-sm text-gray-500">Preparando os cálculos...</p>
            </div>
            
            {/* Skeleton form */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-4 bg-gray-200 rounded animate-pulse`} style={{width: `${60 + i * 15}%`}}></div>
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="h-10 bg-purple-100 rounded animate-pulse flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2"></div>
                  <span className="text-purple-600 text-sm">Inicializando...</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full animate-pulse transition-all duration-1000" style={{width: '85%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Quase pronto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  );
}