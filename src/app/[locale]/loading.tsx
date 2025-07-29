import { Icons } from '@/components/icons';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated calculator icon */}
        <div className="relative">
          <Icons.math className="w-16 h-16 text-purple-600 animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Carregando calculadora...</h2>
          <p className="text-sm text-gray-500">Preparando suas ferramentas de cálculo</p>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}