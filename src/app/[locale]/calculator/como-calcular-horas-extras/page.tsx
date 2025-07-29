'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ComoCalcularHorasExtras = () => {
  const t = useTranslations('OvertimeCalculator');
  
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('howToCalculateTitle')}</h2>
            <p>
              {t('howToCalculateText')}
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                {t('step1')}
              </li>
              <li>
                {t('step2')}
              </li>
              <li>
                {t('step3')}
              </li>
              <li>
                {t('step4')}
              </li>
              <li>
                {t('step5')}
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('overtimeValueTitle')}</h2>
            <p>
              {t('overtimeValueText')}
            </p>
            <h3 className="text-lg font-semibold mt-4">{t('step1Title')}</h3>
            <p>
              {t('step1Text')}
            </p>
            <p className="font-semibold">{t('monthlyContractExample')}</p>
            <p>{t('monthlyContractText')}</p>
            <p className="font-semibold">{t('weeklyContractExample')}</p>
            <p>{t('weeklyContractText')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4">{t('step2Title')}</h3>
            <p>
              {t('step2Text')}
            </p>
            <p>{t('overtimeCalcExample')}</p>
            <p>{t('overtimeFormula1')}</p>
            <p>{t('overtimeFormula2')}</p>
            <p>{t('overtimeFormula3')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComoCalcularHorasExtras;
