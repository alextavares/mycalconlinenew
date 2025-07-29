'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function WordCharacterCounter() {
  const t = useTranslations('word-counter'); // Initialize translations
  const [text, setText] = useState('');
  const { toast } = useToast();

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

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = text.length;

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
          <div className="flex justify-around items-center text-center">
            <div>
              <p className="text-3xl font-bold text-purple-700">{characterCount}</p>
              <p className="text-sm text-purple-600">{t('characterCountLabel')}</p>
            </div>
            <div className="border-l border-purple-300 h-12 mx-4"></div> {/* Vertical separator */}
            <div>
              <p className="text-3xl font-bold text-purple-700">{wordCount}</p>
              <p className="text-sm text-purple-600">{t('wordCountLabel')}</p>
            </div>
          </div>
        </div>

        <Textarea
          className="w-full h-60 p-3 border-2 border-purple-500 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none rounded-md mb-4"
          placeholder={t('placeholder')}
          value={text}
          onChange={handleTextChange}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={clearText}>{t('clearButton')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
