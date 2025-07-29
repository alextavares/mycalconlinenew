'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ClickFeedbackButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ClickFeedbackButton({ 
  href, 
  children, 
  className = "", 
  variant = "default" 
}: ClickFeedbackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Reset loading state after navigation (in case user comes back)
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        variant={variant}
        className={`${className} transition-all duration-200 ease-in-out transform ${
          isLoading ? 'scale-95 opacity-80' : 'hover:scale-105'
        }`}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </Link>
  );
}