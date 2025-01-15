import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CalculatorForm {
  price: number;
  downPayment: number;
  term: number;
  interestRate: number;
}

export function FinanceCalculator() {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<CalculatorForm>({
    defaultValues: {
      price: 50000,
      downPayment: 10000,
      term: 60,
      interestRate: 3.5,
    },
  });

  const calculatePayment = (data: CalculatorForm) => {
    const principal = data.price - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const numberOfPayments = data.term;

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(payment);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Finanzierungsrechner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(calculatePayment)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price">Fahrzeugpreis (CHF)</Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPayment">Anzahlung (CHF)</Label>
            <Input
              id="downPayment"
              type="number"
              {...register("downPayment", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Laufzeit (Monate): {watch("term")}</Label>
            <Slider
              value={[watch("term")]}
              onValueChange={(value) => setValue("term", value[0])}
              max={84}
              min={12}
              step={12}
            />
          </div>

          <div className="space-y-2">
            <Label>Zinssatz (%): {watch("interestRate")}</Label>
            <Slider
              value={[watch("interestRate")]}
              onValueChange={(value) => setValue("interestRate", value[0])}
              max={10}
              min={1}
              step={0.1}
            />
          </div>

          <Button type="submit" className="w-full">
            Berechnen
          </Button>

          {monthlyPayment && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                Geschätzte monatliche Rate:
                <span className="text-primary ml-2">
                  CHF {monthlyPayment.toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}