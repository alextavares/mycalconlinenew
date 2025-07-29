'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, BarChart3, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Calculator className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quick Calculator</h2>
          <p className="text-gray-600 mb-4">Access your favorite calculators</p>
          <Link href="/" passHref>
            <Button className="w-full">Browse Calculators</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BarChart3 className="h-8 w-8 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-gray-600 mb-4">View your calculation history</p>
          <Button variant="secondary" className="w-full" disabled>
            Coming Soon
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Settings className="h-8 w-8 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 mb-4">Customize your experience</p>
          <Button variant="secondary" className="w-full" disabled>
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
}