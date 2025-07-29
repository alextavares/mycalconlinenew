'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Using react-icons: FaMousePointer for click area, FaRegClock for timer
import { FaMousePointer, FaRegClock } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
// You might need a specific icon for the faded background one,
// using FaRegClock as a placeholder for the background icon too
// or remove it if it's too complex/not available.

export default function ClickCounterPage() {
  const t = useTranslations('ClickCounterCalculator');

  // Simple Click Counter State
  const [clickCount, setClickCount] = useState(0);
  const [addAmount, setAddAmount] = useState('1');

  // CPS Test State
  const [cpsClickCount, setCpsClickCount] = useState(0);
  const [testDuration, setTestDuration] = useState(5); // Default duration 5 seconds
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [isTesting, setIsTesting] = useState(false);
  const [cps, setCps] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // Timer Effect for CPS Test
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isTesting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTesting) {
      setIsTesting(false);
      setTestFinished(true);
      // Ensure division by zero is handled if duration could be 0 (though unlikely with select)
      setCps(testDuration > 0 ? cpsClickCount / testDuration : 0);
    }

    // Cleanup timer
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTesting, timeLeft, cpsClickCount, testDuration]);

   // Reset timeLeft when duration changes and not testing
   useEffect(() => {
    if (!isTesting) {
      setTimeLeft(testDuration);
    }
  }, [testDuration, isTesting]);


  // --- Simple Click Counter Handlers ---
  const handleIncrement = useCallback(() => {
    setClickCount((prevCount) => prevCount + 1);
  }, []);

  const handleAddAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only non-negative integers
      setAddAmount(value);
      // Add the clicks immediately when the input changes (optional, based on desired UX)
      // Or keep the button logic if preferred
      const amountToAdd = parseInt(value, 10);
       if (!isNaN(amountToAdd) && amountToAdd >= 0) {
           // If you want to add immediately on change:
           // setClickCount(prevCount => prevCount + amountToAdd);
           // If using a separate add action (like original code without button):
           // No action here, wait for an explicit add trigger if needed.
           // Since the image doesn't show an add button, maybe clicking outside or pressing Enter could trigger it,
           // or maybe it's just for display/manual addition. The original code HAD a button.
           // Let's stick to the image: no explicit add button. We'll need a way to trigger the add,
           // perhaps implicitly or maybe the design assumes manual tracking.
           // Let's keep the input for setting a value, but remove the ADD button as per image.
       }
    }
  };

   // This function is now unused if we remove the button, but kept for reference
   /*
   const handleAddClicks = () => {
       const amountToAdd = parseInt(addAmount, 10);
       if (!isNaN(amountToAdd) && amountToAdd > 0) {
           setClickCount(prevCount => prevCount + amountToAdd);
       }
   }
   */

  const handleResetCounter = () => {
    setClickCount(0);
    setAddAmount('1'); // Reset input to 1
  };

  // --- CPS Test Handlers ---
  const handleStartTest = () => {
    setCpsClickCount(0);
    setTimeLeft(testDuration); // Reset timer to selected duration
    setIsTesting(true);
    setTestFinished(false);
    setCps(0);
  };

  const handleCpsClick = useCallback(() => {
    // Only count clicks if the test is actually running
    if (isTesting && timeLeft > 0) {
      setCpsClickCount((prevCount) => prevCount + 1);
    }
  }, [isTesting, timeLeft]); // Add timeLeft dependency

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value, 10);
    if (!isTesting && !isNaN(duration) && duration > 0) { // Prevent changing during test and ensure valid number
        setTestDuration(duration);
        // TimeLeft is updated by the useEffect hook now
        setTestFinished(false); // Reset finished state
        setCps(0);             // Reset CPS score
        setCpsClickCount(0);   // Reset click count for the new duration setting
    }
  };

  // Format CPS display
  const displayCps = testFinished ? cps.toFixed(2) : 0;

  return (
    // Removed container mx-auto px-4 py-8 to rely on Card's padding or parent layout
    // Added a subtle background to the page like the image might imply
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg"> {/* Added shadow */}
        <CardHeader className="text-center pb-4"> {/* Reduced bottom padding */}
          <CardTitle className="text-3xl font-bold text-purple-700"> {/* Matched color */}
            {t('title')}
          </CardTitle>
           {/* Adjusted text color and margin */}
          <p className="text-gray-500 mt-2 text-sm">
            {t('description')}
          </p>
        </CardHeader>
        {/* Adjusted grid gap and top margin */}
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          {/* Simple Click Counter Section */}
           {/* Adjusted padding, background, shadow */}
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
            {/* Reusing clicksLabel for this subtitle */}
            <h3 className="text-xl font-semibold mb-5 text-gray-800">{t('clicksLabel')}</h3>
            {/* Click area styling */}
            <div
              className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer mb-5 border border-gray-200 relative" // Added relative for potential icon positioning
              onClick={handleIncrement}
              aria-label={t('incrementAriaLabel')}
              role="button"
            >
              {/* Icon styling to match image (faded) */}
              <FaMousePointer size={50} className="text-gray-300 opacity-80" />
            </div>
             {/* Display bar styling */}
            <div className="w-full p-3 bg-purple-50 rounded-lg text-center mb-5">
              <p className="text-lg font-bold text-purple-700">{t('clicksLabel')} <span className="text-purple-900">{clickCount}</span></p>
            </div>
            {/* Somar section styling */}
            <div className="flex items-center justify-center space-x-2 mb-5 w-full">
                <Label htmlFor="addAmount" className="text-sm text-gray-600 whitespace-nowrap">{t('addLabel')}</Label>
                 <Input
                    id="addAmount"
                    type="text" // Use text and pattern for better control on mobile
                    inputMode="numeric" // Hint for numeric keyboard on mobile
                    pattern="[0-9]*" // Pattern for validation
                    value={addAmount}
                    onChange={handleAddAmountChange}
                    className="w-16 h-8 text-center border-gray-300 rounded" // Adjusted styling
                    aria-label={t('addInputAriaLabel')}
                 />
                 {/* Removed the button, added text */}
                 <span className="text-sm text-gray-600">{t('addUnitLabel')}</span>
            </div>
            {/* Reset button styling */}
            <Button onClick={handleResetCounter} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow">
              {t('resetButton')}
            </Button>
          </div>

          {/* CPS Test Section */}
          {/* Adjusted padding, background, shadow */}
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
            {/* Reusing title key for subtitle */}
            <h3 className="text-xl font-semibold mb-5 text-gray-800">{t('title')}</h3>
             {/* Click area styling - Added relative positioning */}
            <div
              className={`w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-5 border border-gray-200 relative ${isTesting ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={handleCpsClick}
              aria-live="polite"
              role="button" // Role changes based on state below potentially
            >
              {/* Faded background icon (optional, adjust icon and styling) */}
               {!isTesting && !testFinished && (
                 <FaRegClock size={80} className="text-gray-300 opacity-50 absolute z-0" />
               )}

              {/* Content inside click area */}
              <div className="relative z-10 text-center"> {/* Ensure content is above background icon */}
                {!isTesting && !testFinished && (
                  <Button onClick={handleStartTest} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-md shadow-md">
                    {t('startButton')}
                  </Button>
                )}
                {isTesting && (
                  <>
                     {/* More prominent "Clique!" text during test */}
                     <p className="text-5xl font-bold text-purple-600 animate-pulse">{t('clickArea')}</p>
                     {/* <p className="text-2xl text-gray-500 mt-2">{timeLeft}s</p> Removed time from here */}
                  </>
                )}
                {testFinished && (
                  <>
                    <p className="text-xl text-gray-700 font-medium">{t('testFinishedMessage')}</p>
                    <p className="text-4xl font-bold text-purple-600 mt-1">{cps.toFixed(2)} <span className="text-2xl">{t('cpsUnitLabel')}</span></p>
                    {/* Display total clicks for the finished test */}
                    <p className="text-sm text-gray-500 mt-2">{t('testResultDetails', { count: cpsClickCount, duration: testDuration })}</p>
                  </>
                )}
              </div>
            </div>

            {/* Display bar styling */}
            <div className="w-full p-3 bg-purple-50 rounded-lg text-center mb-4 flex justify-around items-center">
              <p className="text-lg font-bold text-purple-700">{t('clicksLabel')} <span className="text-purple-900">{cpsClickCount}</span></p>
              <p className="text-lg font-bold text-purple-700">{t('cpsLabel')} <span className="text-purple-900">{displayCps}</span></p>
            </div>

            {/* Timer display area - BEFORE or DURING test */}
             <div className="text-center text-gray-600 font-medium h-9 mb-4 flex items-center justify-center space-x-2 w-full">
                 {isTesting && (
                     <>
                        <FaRegClock className="text-gray-500" />
                        <span>{t('timeLeftLabel', { time: timeLeft })}</span>
                     </>
                 )}
                {/* Show "? segs." only before the test starts */}
                 {!isTesting && !testFinished && (
                     <>
                        <FaRegClock className="text-gray-400" />
                        <span className="text-gray-400">{t('timeLeftPlaceholder')}</span>
                     </>
                 )}
                 {/* Optionally show something when finished, or leave blank */}
                 {testFinished && (
                     <span className="text-green-600">{t('testCompleteMessage')}</span>
                 )}
             </div>


             {/* Duration selector and Restart Button Area */}
             <div className="w-full flex flex-col items-center mt-auto"> {/* Use mt-auto to push to bottom if needed */}
                 {/* Show duration selector only when not testing */}
                 {!isTesting && (
                    <div className="flex items-center justify-center space-x-2 w-full mb-4">
                        <Label htmlFor="duration" className="text-sm text-gray-600">{t('durationLabel')}</Label>
                        <Select onValueChange={handleDurationChange} value={testDuration.toString()} disabled={isTesting}>
                            <SelectTrigger className="w-[100px] h-9 border-gray-300 rounded">
                                <SelectValue placeholder={t('durationPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">{t('duration1s')}</SelectItem>
                                <SelectItem value="3">{t('duration3s')}</SelectItem>
                                <SelectItem value="5">{t('duration5s')}</SelectItem>
                                <SelectItem value="10">{t('duration10s')}</SelectItem>
                                <SelectItem value="15">{t('duration15s')}</SelectItem>
                                <SelectItem value="30">{t('duration30s')}</SelectItem>
                                <SelectItem value="60">{t('duration60s')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 )}

                {/* Show Restart button only when finished */}
                 {testFinished && !isTesting && (
                     <Button onClick={handleStartTest} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-md shadow-md mt-2">
                         {t('restartButton')}
                     </Button>
                 )}
             </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
