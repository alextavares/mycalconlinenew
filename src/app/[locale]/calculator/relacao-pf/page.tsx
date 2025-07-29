'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PFCalculator() {
  const [paO2, setPaO2] = useState<number | null>(null);
  const [fiO2, setFiO2] = useState<number | null>(null);
  const [pfRatio, setPfRatio] = useState<number | null>(null);
  const [severity, setSeverity] = useState<string | null>(null);

  const calculatePfRatio = () => {
    if (paO2 !== null && fiO2 !== null) {
      const ratio = (paO2 / fiO2) * 100;
      setPfRatio(ratio);

      if (ratio > 300) {
        setSeverity("Normal");
      } else if (ratio >= 200 && ratio <= 300) {
        setSeverity("Leve");
      } else if (ratio >= 100 && ratio < 200) {
        setSeverity("Moderado");
      } else {
        setSeverity("Grave");
      }
    } else {
        setPfRatio(null);
        setSeverity(null)
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Calculadora Relação P/F (PaO2/FiO2)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-gray-600">
            Calcule a Relação P/F para avaliar a oxigenação pulmonar de um paciente.
            Descubra seus valores normais e sua importância em casos de hipoxemia e SDRA.
          </p>
          <div className="grid gap-2">
            <label htmlFor="pao2">PaO2 (mmHg)</label>
            <Input
              id="pao2"
              type="number"
              placeholder="Ex: 80"
              onChange={(e) => setPaO2(e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="fio2">FiO2 (%)</label>
            <Input
              id="fio2"
              type="number"
              placeholder="Ex: 21"
              onChange={(e) => setFiO2(e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
          <Button id="calcular" onClick={calculatePfRatio}>
            Calcular
          </Button>
          <div className="mt-4">
            <p className="font-semibold">Relação P/F: {pfRatio !== null ? pfRatio.toFixed(2) : "?"}</p>
            <p className="font-semibold">Gravidade: {severity || "?"}</p>
          </div>
          <p className="text-sm text-gray-500">
            *Com PEEP ≥ 5. Fórmula utilizada: (PaO2/FiO2)*100
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    