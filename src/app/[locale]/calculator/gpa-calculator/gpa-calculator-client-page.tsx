'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Calculator, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Award,
  BookOpen,
  History
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

const DEFAULT_GRADE_SCALE: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export default function GPACalculatorClientPage() {
  const t = useTranslations('GPACalculator');

  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', credits: '3' },
    { id: '2', name: '', grade: 'B', credits: '3' },
    { id: '3', name: '', grade: 'A', credits: '3' },
  ]);

  const [previousGPA, setPreviousGPA] = useState<string>('');
  const [previousCredits, setPreviousCredits] = useState<string>('');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatIs: true,
    howTo: false,
    tips: false,
    faq: false
  });

  const stats = useMemo(() => {
    let currentTotalPoints = 0;
    let currentTotalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const gradePoint = DEFAULT_GRADE_SCALE[course.grade] || 0;
      if (!isNaN(credits) && credits > 0) {
        currentTotalPoints += gradePoint * credits;
        currentTotalCredits += credits;
      }
    });

    const currentGPA = currentTotalCredits > 0 ? currentTotalPoints / currentTotalCredits : 0;

    let overallGPA = currentGPA;
    let overallTotalCredits = currentTotalCredits;

    const prevGPA = parseFloat(previousGPA);
    const prevCredits = parseFloat(previousCredits);

    if (!isNaN(prevGPA) && !isNaN(prevCredits) && prevCredits > 0) {
      const prevTotalPoints = prevGPA * prevCredits;
      overallTotalCredits = currentTotalCredits + prevCredits;
      overallGPA = (currentTotalPoints + prevTotalPoints) / overallTotalCredits;
    }

    return {
      currentGPA,
      currentTotalCredits,
      overallGPA,
      overallTotalCredits
    };
  }, [courses, previousGPA, previousCredits]);

  const addCourse = () => {
    setCourses([...courses, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: '', 
      grade: 'A', 
      credits: '3' 
    }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const clearAll = () => {
    setCourses([{ id: '1', name: '', grade: 'A', credits: '3' }]);
    setPreviousGPA('');
    setPreviousCredits('');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Calculator Main Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {t('currentSemester')}
                </h2>
                <button 
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  {t('clearAll')}
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={course.id} className="grid grid-cols-12 gap-3 items-end group">
                    <div className="col-span-5 md:col-span-6">
                      {index === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('courseName')}</label>}
                      <input
                        type="text"
                        placeholder={t('coursePlaceholder')}
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      {index === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('grade')}</label>}
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm appearance-none"
                      >
                        {Object.keys(DEFAULT_GRADE_SCALE).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      {index === 0 && <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t('credits')}</label>}
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button 
                        onClick={() => removeCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors mb-1"
                        title={t('removeCourse')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addCourse}
                className="mt-6 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                {t('addCourse')}
              </button>
            </div>

            {/* Cumulative GPA Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-purple-600" />
                {t('cumulativeGPA')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('previousGPA')}</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={previousGPA}
                    onChange={(e) => setPreviousGPA(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t('totalPreviousCredits')}</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={previousCredits}
                    onChange={(e) => setPreviousCredits(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white sticky top-8">
              <div className="flex items-center gap-2 mb-6 text-blue-100">
                <Calculator className="w-5 h-5" />
                <span className="font-semibold uppercase tracking-wider text-xs">{t('results')}</span>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="text-blue-100 text-sm mb-1">{t('semesterGPA')}</div>
                  <div className="text-5xl font-black">{stats.currentGPA.toFixed(2)}</div>
                </div>

                <div className="h-px bg-white/20 w-full" />

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="text-blue-100 text-xs mb-1 uppercase tracking-wide">{t('cumulative')}</div>
                    <div className="text-3xl font-bold">{stats.overallGPA.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-blue-100 text-xs mb-1 uppercase tracking-wide">{t('totalCredits')}</div>
                    <div className="text-2xl font-bold">{stats.overallTotalCredits}</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold uppercase">{t('academicStanding')}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {stats.overallGPA >= 3.5 ? t('standing.excellent') : 
                     stats.overallGPA >= 3.0 ? t('standing.good') : 
                     stats.overallGPA >= 2.0 ? t('standing.satisfactory') : t('standing.poor')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Sections */}
        <div className="space-y-4">
          {/* What Is */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('whatIs')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('whatIs.title')}</h2>
              {expandedSections.whatIs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.whatIs && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: t.raw('whatIs.content') }} />
              </div>
            )}
          </div>

          {/* How to Calculate */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('howTo')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('howTo.title')}</h2>
              {expandedSections.howTo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.howTo && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: t.raw('howTo.content') }} />
              </div>
            )}
          </div>

          {/* Study Tips */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('tips.title')}</h2>
              {expandedSections.tips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.tips && (
              <div className="px-6 pb-6">
                <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: t.raw('tips.content') }} />
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('faq.title')}</h2>
              {expandedSections.faq ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-6 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-bold text-gray-900 mb-2">{t(`faq.q${i}`)}</h3>
                    <p className="text-gray-600 text-sm">{t(`faq.a${i}`)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
