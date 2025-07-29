'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AreaCuboCalculator() {
  const t = useTranslations('CubeAreaCalculator')
  const [edge, setEdge] = useState<string>('')
  const [area, setArea] = useState<number | null>(null)

  const calculateArea = () => {
    const a = parseFloat(edge)

    if (!isNaN(a) && a > 0) {
      // Area of a cube = 6 * a^2
      const calculatedArea = 6 * Math.pow(a, 2)
      setArea(calculatedArea)
    } else {
      setArea(null) // Reset area if input is invalid
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-purple-600">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center items-center">
            {/* Simple SVG representation of a cube */}
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white">
              {/* Front face */}
              <rect x="40" y="40" width="70" height="70" stroke="currentColor" strokeWidth="2"/>
              {/* Top face */}
              <path d="M 40 40 L 65 20 L 135 20 L 110 40 Z" stroke="currentColor" strokeWidth="2"/>
              {/* Side face */}
              <path d="M 110 40 L 135 20 L 135 90 L 110 110 Z" stroke="currentColor" strokeWidth="2"/>
              {/* Edge labels */}
              <text x="70" y="125" fontSize="16" fill="currentColor" className="font-sans">a</text> { /* Bottom edge */}
              <text x="115" y="80" fontSize="16" fill="currentColor" className="font-sans">a</text> { /* Right edge */}
              <text x="95" y="35" fontSize="16" fill="currentColor" className="font-sans">a</text> { /* Top edge */}
            </svg>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <div>
              <Label htmlFor="edge">{t('edgeLabel')}</Label>
              <Input
                id="edge"
                type="number"
                placeholder={t('edgePlaceholder')}
                value={edge}
                onChange={(e) => setEdge(e.target.value)}
                min="0"
                step="any"
                className="mt-1"
              />
            </div>
            <Button onClick={calculateArea} className="w-full bg-purple-600 hover:bg-purple-700 text-white">{t('calculateButton')}</Button>
            {area !== null && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-center">
                <p className="text-sm font-medium text-gray-800">{t('resultLabel')}</p>
                <p className="text-2xl font-bold text-black">{area.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
