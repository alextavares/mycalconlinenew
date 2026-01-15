'use client';

import React, { useState, useMemo, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { useCounter } from '@/hooks/use-counter';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Copy, Check, RotateCcw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { calculators } from '@/config/calculators';

interface CalculatorConfig {
    id: string;
    // ... other properties
    [key: string]: any;
}

function ResultValue({ value }: { value: string | number }) {
    const isNumber = typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)));
    const numValue = isNumber ? Number(value) : 0;

    // Only animate if it's a valid number and not too long/Scientific notation that might break UI
    const animatedValue = useCounter(isNumber ? numValue : 0, 1000);

    if (!isNumber) return <span>{value}</span>;

    return <span>{Number(animatedValue.toFixed(4)).toString()}</span>;
}

interface Props {
    calculatorId: string;
}

export function CalculatorEngineClient({ calculatorId }: Props) {
    const calculator = calculators[calculatorId];
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    const locale = useLocale();
    const t = useTranslations('Calculators');

    // ... (keep existing check) ...

    if (!calculator) {
        // ... (keep existing return) ...
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <LucideIcons.AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Calculator Not Found</h2>
                <p className="text-gray-500 mt-2">The configuration for ID "{calculatorId}" is missing.</p>
            </div>
        );
    }

    // Resolve localized content (Fallback to generated content if translation missing)
    // Note: t.has() checks if key exists. t.raw() returns the value (string or object/array)
    // We assume 'whatIs' and 'howTo' are HTML strings in JSON if present.
    // We assume 'faq' is Array<{question, answer}> in JSON if present.
    const localizedContent = useMemo(() => {
        const hasWhatIs = t.has(`${calculatorId}.whatIs`);
        const hasHowTo = t.has(`${calculatorId}.howTo`);
        const hasFaq = t.has(`${calculatorId}.faq`);

        // Generate fallback content from calculator config when translations are missing
        const generateFallbackWhatIs = () => {
            const title = calculator.title || calculatorId;
            const desc = calculator.description || '';
            return `<p>The <strong>${title}</strong> is a free online tool that helps you ${desc.toLowerCase().replace(/\.$/, '')}.</p>
                    <p>Simply enter the required values in the fields above, and the calculator will automatically compute the result for you.</p>
                    <p>This calculator is part of our collection of ${calculator.category || 'utility'} calculators, designed to make complex calculations simple and accessible.</p>`;
        };

        const generateFallbackHowTo = () => {
            const inputs = calculator.inputs || [];
            const inputNames = inputs.map(i => i.label).join(', ');
            return `<ol>
                        <li><strong>Enter the values:</strong> Fill in the required fields${inputNames ? ` (${inputNames})` : ''}.</li>
                        <li><strong>View the result:</strong> The calculation is performed automatically as you type.</li>
                        <li><strong>Copy or share:</strong> Use the buttons to copy the result or share this calculator.</li>
                    </ol>`;
        };

        // Check if content exists and is not just a translation key placeholder
        const isValidContent = (content: any) => {
            if (!content) return false;
            if (typeof content !== 'string') return false;
            // Check if it looks like a placeholder key (e.g., "calculator-id.whatIs")
            if (content.includes('.whatIs') || content.includes('.howTo')) return false;
            return content.length > 10;
        };

        const configWhatIs = calculator.content?.whatIs;
        const configHowTo = calculator.content?.howTo;

        return {
            whatIs: hasWhatIs ? t.raw(`${calculatorId}.whatIs`)
                : isValidContent(configWhatIs) ? configWhatIs
                    : generateFallbackWhatIs(),
            howTo: hasHowTo ? t.raw(`${calculatorId}.howTo`)
                : isValidContent(configHowTo) ? configHowTo
                    : generateFallbackHowTo(),
            faq: hasFaq ? t.raw(`${calculatorId}.faq`) : calculator.content?.faq || []
        };
    }, [calculatorId, t, calculator]);

    // Format localized FAQ if needed (ensure it matches expected shape)
    // If JSON returns generic object, standard casting might be needed, but .raw() usually suffices for simple arrays.


    // Get the icon component
    const IconComponent = calculator.icon ? (LucideIcons as any)[calculator.icon] : LucideIcons.Calculator;

    // State for inputs
    const [inputs, setInputs] = useState<Record<string, any>>(() => {
        const defaults: Record<string, any> = {};
        calculator.inputs?.forEach(input => {
            if (input.defaultValue !== undefined) defaults[input.id] = input.defaultValue;
        });
        return defaults;
    });

    // State for expanded sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        whatIs: true,
        howTo: false,
        faq: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleInputChange = (id: string, value: any) => {
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleReset = () => {
        const defaults: Record<string, any> = {};
        calculator.inputs?.forEach(input => {
            if (input.defaultValue !== undefined) defaults[input.id] = input.defaultValue;
        });
        setInputs(defaults);
    };

    // Calculate results
    const results = useMemo(() => {
        if (!calculator.outputs) return [];
        return calculator.outputs.map(output => {
            try {
                const value = output.calculate(inputs);
                return { label: output.label, value, unit: output.unit };
            } catch {
                return { label: output.label, value: '-', unit: output.unit };
            }
        });
    }, [inputs, calculator.outputs]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const shareData = {
            title: t.has(`${calculatorId}.title`) ? t(`${calculatorId}.title`) : calculator.title,
            text: t.has(`${calculatorId}.description`) ? t(`${calculatorId}.description`) : calculator.description,
            url: window.location.href,
        };
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    // Localized Title/Desc/Category for display
    const displayTitle = t.has(`${calculatorId}.title`) ? t(`${calculatorId}.title`) : calculator.title;
    const displayDesc = t.has(`${calculatorId}.description`) ? t(`${calculatorId}.description`) : calculator.description;
    // Category translation? Assuming standard keys or fallback
    // const displayCategory = t.has(`categories.${calculator.category}`) ... ?
    // But categories are usually in 'Layout.categories' or similar. 
    // Let's stick to calculator prop or if we want to localize category we need another t provider or key.
    // For now, keeping category as is or simple capitalization.

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <li className="inline-flex items-center">
                        <a href={`/${locale}`} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                            <LucideIcons.Home className="w-3 h-3" /> Home
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <LucideIcons.ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                            <span className="capitalize text-gray-600">{calculator.category}</span>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <LucideIcons.ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                            <span className="text-blue-600 font-medium">{displayTitle}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Header with improved styling */}
            <div className="text-center bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-sm relative">
                <button
                    onClick={handleShare}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-blue-50 text-blue-600 transition-colors shadow-sm border border-gray-100"
                    title="Share this calculator"
                >
                    {shared ? <Check className="w-4 h-4" /> : <LucideIcons.Share2 className="w-4 h-4" />}
                </button>
                <div className="inline-flex items-center justify-center p-3.5 bg-white rounded-2xl shadow-md border border-gray-100 mb-6 group transition-transform hover:scale-105">
                    {IconComponent && <IconComponent className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors" />}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        {calculator.category}
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{displayTitle}</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{displayDesc}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Inputs Section */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <LucideIcons.Settings2 className="w-5 h-5 text-gray-400" />
                            Configuration
                        </h2>
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {calculator.inputs.map(input => {
                            // Check visibility condition
                            if (input.condition && !input.condition(inputs)) {
                                return null;
                            }

                            return (
                                <div key={input.id} className="group animate-in fade-in slide-in-from-top-1 duration-200">
                                    <label htmlFor={input.id} className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                        {input.label}
                                    </label>
                                    <div className="relative transform transition-all duration-200 focus-within:-translate-y-0.5">
                                        {input.type === 'select' ? (
                                            <div className="relative">
                                                <select
                                                    id={input.id}
                                                    value={inputs[input.id] || ''}
                                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                    className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 text-lg appearance-none cursor-pointer font-medium"
                                                >
                                                    {input.options?.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        ) : input.type === 'checkbox' ? (
                                            <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white transition-colors cursor-pointer" onClick={() => handleInputChange(input.id, !inputs[input.id])}>
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${inputs[input.id] ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                                    {inputs[input.id] && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className="text-gray-900 font-medium select-none">{input.placeholder || 'Enable'}</span>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type={input.type}
                                                    id={input.id}
                                                    value={inputs[input.id] || ''}
                                                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                    placeholder={input.placeholder}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 text-lg font-medium placeholder:text-gray-300"
                                                    min={input.type === 'date' ? '1900-01-01' : undefined}
                                                    max={input.type === 'date' ? '2100-12-31' : undefined}
                                                />
                                                {input.unit && (
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm bg-gray-100/50 px-2 py-1 rounded-md">
                                                        {input.unit}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-900/10 p-6 md:p-8 text-white relative overflow-hidden">
                        {/* Decorative background blob */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                        <h3 className="text-blue-100 font-semibold mb-6 flex items-center gap-2">
                            <LucideIcons.Equal className="w-5 h-5" />
                            Result
                        </h3>

                        {results && results.length > 0 ? (
                            <div className="space-y-6 relative z-10">
                                {results.map((result, idx) => (
                                    <div key={idx} className={`${idx === 0 ? '' : 'pt-4 border-t border-white/10'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        <div className="text-blue-200 text-sm font-medium mb-1">{result.label}</div>
                                        <div className="flex items-end gap-2 group cursor-pointer" onClick={() => handleCopy(String(result.value))}>
                                            <div className={`${idx === 0 ? 'text-4xl' : 'text-2xl'} font-bold tracking-tight text-white break-words tabular-nums`}>
                                                <ResultValue value={result.value} />
                                            </div>
                                            {result.unit && (
                                                <div className={`${idx === 0 ? 'mb-2 text-lg' : 'mb-1 text-sm'} text-blue-200 font-medium opacity-80`}>
                                                    {result.unit}
                                                </div>
                                            )}
                                            {idx === 0 && (
                                                <button className="mb-2 ml-auto p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors opacity-0 group-hover:opacity-100">
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-blue-200/60">
                                <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-white/5 mb-3">
                                    <LucideIcons.Calculator className="w-6 h-6" />
                                </div>
                                <p className="text-sm">Enter values to calculate</p>
                            </div>
                        )}
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="grid gap-3">
                            <button
                                onClick={handleShare}
                                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                {shared ? <Check className="w-5 h-5" /> : <LucideIcons.Share2 className="w-5 h-5" />}
                                {shared ? 'Copied Link!' : 'Share Result'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-all active:scale-95"
                                >
                                    <LucideIcons.RefreshCw className="w-4 h-4" />
                                    Reload
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200 transition-all active:scale-95"
                                >
                                    <LucideIcons.Eraser className="w-4 h-4" />
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">
                                Did this solve your problem?
                                <span className="mx-2 cursor-pointer hover:text-green-500 transition-colors">👍 Yes</span>
                                <span className="cursor-pointer hover:text-red-500 transition-colors">👎 No</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {/* What Is */}
                {localizedContent.whatIs && (
                    <div className="bg-white">
                        <button
                            onClick={() => toggleSection('whatIs')}
                            className="w-full flex items-center justify-between p-6 md:px-8 text-left hover:bg-gray-50/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${expandedSections.whatIs ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} group-hover:bg-blue-50 transition-colors`}>
                                    <LucideIcons.BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">What is this?</h2>
                            </div>
                            {expandedSections.whatIs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        {expandedSections.whatIs && (
                            <div className="px-6 md:px-8 pb-8 pt-2 prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300" dangerouslySetInnerHTML={{ __html: localizedContent.whatIs }} />
                        )}
                    </div>
                )}

                {/* How To */}
                {localizedContent.howTo && (
                    <div className="bg-white">
                        <button
                            onClick={() => toggleSection('howTo')}
                            className="w-full flex items-center justify-between p-6 md:px-8 text-left hover:bg-gray-50/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${expandedSections.howTo ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} group-hover:bg-blue-50 transition-colors`}>
                                    <LucideIcons.Lightbulb className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">How to Use</h2>
                            </div>
                            {expandedSections.howTo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        {expandedSections.howTo && (
                            <div className="px-6 md:px-8 pb-8 pt-2 prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300" dangerouslySetInnerHTML={{ __html: localizedContent.howTo }} />
                        )}
                    </div>
                )}

                {/* FAQ */}
                {localizedContent.faq && (localizedContent.faq as any[]).length > 0 && (
                    <div className="bg-white">
                        <button
                            onClick={() => toggleSection('faq')}
                            className="w-full flex items-center justify-between p-6 md:px-8 text-left hover:bg-gray-50/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${expandedSections.faq ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} group-hover:bg-blue-50 transition-colors`}>
                                    <LucideIcons.HelpCircle className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">FAQ</h2>
                            </div>
                            {expandedSections.faq ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        {expandedSections.faq && (
                            <div className="px-6 md:px-8 pb-8 pt-2 space-y-6 animate-in fade-in slide-in-from-top-1 duration-300">
                                {(localizedContent.faq as any[]).map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                                            <span className="text-blue-500">Q:</span> {item.question}
                                        </h3>
                                        <p className="text-gray-600 pl-6 border-l-2 border-blue-200">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Related Calculators Section */}
            <div className="border-t border-gray-200 pt-12 mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Calculators</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {Object.values(calculators)
                        .filter(c => c.category === calculator.category && c.id !== calculatorId)
                        .slice(0, 3)
                        .map(related => (
                            <a
                                key={related.id}
                                href={`/${locale}/calculator/${related.id}`}
                                className="group block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {(() => {
                                            const Icon = related.icon ? (LucideIcons as any)[related.icon] : LucideIcons.Calculator;
                                            return <Icon className="w-5 h-5" />;
                                        })()}
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
                                        {related.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {related.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {related.description}
                                </p>
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
}
