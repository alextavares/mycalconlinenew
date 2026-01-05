'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, Calculator, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { calculators } from '@/config/calculators';

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('HomePage'); // Reuse existing translations if possible, or fallback

    // Memoize filtered results to avoid expensive re-calculations on every render
    const filteredCalculators = React.useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();

        return Object.values(calculators).filter((calc) =>
            calc.title.toLowerCase().includes(lowerQuery) ||
            calc.description.toLowerCase().includes(lowerQuery) ||
            calc.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to 5 results for cleaner UI
    }, [query]);

    const handleSelect = (slug: string) => {
        setOpen(false);
        setQuery('');
        router.push(`/${locale}/calculator/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search calculators</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
                <DialogHeader className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Type to search..."
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto py-1 text-base"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <div className="max-h-[300px] overflow-y-auto p-2">
                    {query === '' ? (
                        <div className="py-8 text-center text-sm text-gray-500">
                            Start typing to find calculators...
                        </div>
                    ) : filteredCalculators.length > 0 ? (
                        <div className="space-y-1">
                            {filteredCalculators.map((calc) => (
                                <button
                                    key={calc.id}
                                    onClick={() => handleSelect(calc.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-left transition-colors group"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Calculator className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-700">{calc.title}</div>
                                        <div className="text-xs text-gray-500 truncate">{calc.description}</div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-gray-500">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
