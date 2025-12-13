'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Counts = {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  wordDensityPer1000: number;
};

function computeCounts(text: string): Counts {
  const trimmed = text.trim();

  const words = trimmed
    ? (trimmed
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:'[A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g)?.length ?? 0)
    : 0;

  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.length ? text.split(/\r\n|\r|\n/).length : 0;

  const sentences = trimmed
    ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g)?.length ?? (trimmed.length > 0 ? 1 : 0))
    : 0;

  const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0;

  const readingTimeMin = Math.ceil(words / 200 || 0);
  const speakingTimeMin = Math.ceil(words / 130 || 0);

  const wordDensityPer1000 = charsWithSpaces ? Math.round((words / charsWithSpaces) * 1000 * 100) / 100 : 0;

  return {
    words,
    charsWithSpaces,
    charsNoSpaces,
    lines,
    sentences,
    paragraphs,
    readingTimeMin,
    speakingTimeMin,
    wordDensityPer1000
  };
}

export default function WordCharacterCounter() {
  const t = useTranslations('word-counter');
  const { toast } = useToast();

  const [text, setText] = useState('');
  const [persistEnabled] = useState(true);

  useEffect(() => {
    if (!persistEnabled) return;
    try {
      const saved = localStorage.getItem('word-counter:text');
      if (saved) setText(saved);
    } catch {}
  }, [persistEnabled]);

  useEffect(() => {
    if (!persistEnabled) return;
    try {
      localStorage.setItem('word-counter:text', text);
    } catch {}
  }, [text, persistEnabled]);

  const counts = useMemo(() => computeCounts(text), [text]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const clearText = () => {
    setText('');
    toast({
      title: t('toastClearTitle'),
      description: t('toastClearDesc'),
    });
  };

  const handleCopy = async () => {
    if (!text) {
      toast({
        title: t('toastCopyErrorTitle'),
        description: t('toastCopyErrorDescEmpty'),
        variant: 'destructive' as any
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('toastCopySuccessTitle'),
        description: t('toastCopySuccessDesc'),
      });
    } catch {
      toast({
        title: t('toastCopyErrorTitle'),
        description: t('toastCopyErrorDescGeneral'),
        variant: 'destructive' as any
      });
    }
  };

  const handlePaste = async () => {
    try {
      if (!('clipboard' in navigator) || !(navigator as any).clipboard?.readText) {
        toast({
          title: t('toastPasteErrorTitle'),
          description: t('toastPasteErrorDescNotSupported'),
          variant: 'destructive' as any
        });
        return;
      }
      const clip = await navigator.clipboard.readText();
      setText(prev => (prev ? prev + (prev.endsWith('\n') ? '' : '\n') + clip : clip));
      toast({
        title: t('toastPasteSuccessTitle'),
        description: t('toastPasteSuccessDesc'),
      });
    } catch {
      toast({
        title: t('toastPasteErrorTitle'),
        description: t('toastPasteErrorDescGeneral'),
        variant: 'destructive' as any
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.charsWithSpaces}</p>
            <p className="text-sm text-purple-700">{t('characterCountLabel')}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.words}</p>
            <p className="text-sm text-purple-700">{t('wordCountLabel')}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.charsNoSpaces}</p>
            <p className="text-sm text-purple-700">{t('charactersNoSpacesLabel')}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.lines}</p>
            <p className="text-sm text-purple-700">{t('linesLabel')}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.sentences}</p>
            <p className="text-sm text-purple-700">{t('sentencesLabel')}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-700">{counts.paragraphs}</p>
            <p className="text-sm text-purple-700">{t('paragraphsLabel')}</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-md border border-purple-200 bg-white text-sm">
            <span className="font-semibold">{t('readingTimeLabel')}:</span> {counts.readingTimeMin} min
          </div>
          <div className="p-3 rounded-md border border-purple-200 bg-white text-sm">
            <span className="font-semibold">{t('speakingTimeLabel')}:</span> {counts.speakingTimeMin} min
          </div>
        </div>

        <div className="mb-4 p-3 rounded-md border border-purple-200 bg-white text-sm">
          <span className="font-semibold">{t('wordDensityLabel')}:</span> {counts.wordDensityPer1000}
        </div>

        <label htmlFor="word-counter-textarea" className="sr-only">{t('placeholder')}</label>
        <Textarea
          id="word-counter-textarea"
          aria-label={t('placeholder')}
          className="w-full h-64 p-3 border-2 border-purple-500 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 resize-y rounded-md mb-4"
          placeholder={t('placeholder')}
          value={text}
          onChange={handleTextChange}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handlePaste} aria-label={t('pasteButton')}>{t('pasteButton')}</Button>
          <Button variant="outline" onClick={handleCopy} aria-label={t('copyButton')}>{t('copyButton')}</Button>
          <Button variant="outline" onClick={clearText} aria-label={t('clearButton')}>{t('clearButton')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
