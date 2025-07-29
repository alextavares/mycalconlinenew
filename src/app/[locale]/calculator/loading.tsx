import { Icons } from '@/components/icons';

export default function CalculatorLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg">
        {/* Card skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-md border">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Icons.math className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-64"></div>
              </div>
            </div>
          </div>
          
          {/* Form skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
            </div>
            
            <div className="pt-4">
              <div className="h-10 bg-purple-100 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-purple-600">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Carregando calculadora...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}