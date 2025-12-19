'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calculator, TrendingUp, HeartPulse, BarChart3, Ruler, CalendarDays, ArrowLeftRight, MoreHorizontal } from 'lucide-react';

interface NavItem {
  slug: string;
  categoryKey: string;
}

interface StructuredNavData {
  [categoryKey: string]: NavItem[];
}

interface HeaderNavProps {
  navigationData: StructuredNavData | undefined;
  categoryOrder: string[] | undefined;
  currentLocale: string;
}

// Category icons
const categoryIcons: { [key: string]: React.ElementType } = {
  mathematics: Calculator,
  finance: TrendingUp,
  health: HeartPulse,
  statistics: BarChart3,
  geometry: Ruler,
  calendar: CalendarDays,
  converters: ArrowLeftRight,
  others: MoreHorizontal,
};

export default function HeaderNav({ navigationData, categoryOrder, currentLocale }: HeaderNavProps) {
  const tl = useTranslations('Layout');
  const tCalcs = useTranslations('Calculators');

  if (!navigationData || !categoryOrder || categoryOrder.length === 0) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {categoryOrder.map((categoryKey) => {
        const itemsInCategory = navigationData[categoryKey];
        const Icon = categoryIcons[categoryKey] || Calculator;

        if (!itemsInCategory || itemsInCategory.length === 0) {
          return null;
        }

        return (
          <DropdownMenu key={categoryKey}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 px-3 py-2 font-medium text-sm"
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {tl(`categories.${categoryKey}`)}
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white border border-gray-200 shadow-lg rounded-lg max-h-[70vh] overflow-y-auto min-w-[220px]"
              align="start"
              sideOffset={8}
            >
              <div className="py-1">
                {itemsInCategory.map((item) => (
                  <DropdownMenuItem key={item.slug} asChild>
                    <Link
                      href={`/${currentLocale}/calculator/${item.slug}`}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors"
                    >
                      {tCalcs(`${item.slug}.title`)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </nav>
  );
}
