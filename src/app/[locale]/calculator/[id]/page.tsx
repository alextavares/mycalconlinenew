import React from "react";

interface CalculatorProps {
  params: { id: string };
 }

const calculators = {
  imc: {
    title: "Calculadora de IMC",
    description: "Calcule seu Índice de Massa Corporal para avaliar seu peso.",
    fields: [
      { label: "Peso (em kg):", type: "number", id: "peso" },
      { label: "Altura (em metros):", type: "text", id: "altura" }, // Changed type to "text"
    ],
    calculate: (peso: number, altura: number) => {
      //altura = altura / 100;
      const imc = peso / (altura * altura);
      let classification = "";
      if (imc < 18.5) {
        classification = "Abaixo do peso";
      } else if (imc < 25) {
        classification = "Peso normal";
      } else if (imc < 30) {
        classification = "Sobrepeso";
      } else {
        classification = "Obesidade";
      }
      return `Seu IMC é ${imc.toFixed(2)} (${classification})`;
    },
  },
  porcentagem: {
    title: "Calculadora de Porcentagem",
    description: "Calcule porcentagens facilmente.",
    fields: [
      { label: "Quanto é []% de []:", type: "number", id: "porcentagem" },
      { label: "de", type: "number", id: "total" },
    ],
    calculate: (porcentagem: number, total: number) => {
      const resultado = (porcentagem / 100) * total;
      return `${porcentagem}% de ${total} é ${resultado}`;
    },
  },
};


export default async function Calculator({ params }: CalculatorProps) {

  const id = React.use(Promise.resolve(params.id));
  const calculator = calculators[id as keyof typeof calculators];

  if (!calculator) {
    return <div>Calculadora não encontrada.</div>;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const values: number[] = [];

    calculator.fields.forEach((field) => {
      const value = formData.get(field.id);
      if (typeof value === "string") {
        const sanitizedValue = value.replace(",", ".");
        let parsedValue = parseFloat(sanitizedValue);
        if (field.id === "altura") {
          if (parsedValue > 3) {
            parsedValue = parsedValue / 100;
          }
          
           parsedValue = parseFloat(parsedValue.toFixed(2))
          }
        values.push(parsedValue);
      }
    });

    if (calculator.calculate) {
      try {
        if (values.length === 2) {
          setResult(calculator.calculate(values[0], values[1]));
        }
      } catch (error: any) {
        setResult(`Erro no cálculo: ${error.message}`);
      }
    }
  };

  const [result, setResult] = React.useState<string | null>(null);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-4">{calculator.title}</h1>
      <p className="text-lg mb-6">{calculator.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {calculator.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder={`Insira o ${field.label.replace(/[\[\]]/g, "")
                .toLowerCase()
                .split(" ")
                .slice(-1)[0]}`}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/80"
        >
          Calcular
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold">Resultado:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
