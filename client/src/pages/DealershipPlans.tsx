import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const plans: SubscriptionPlan[] = [
  {
    name: "Básico",
    price: 5000,
    features: [
      "Hasta 10 listados activos",
      "Fotos básicas por vehículo",
      "Soporte por correo electrónico",
      "Listados por 30 días",
    ],
  },
  {
    name: "Premium",
    price: 12000,
    features: [
      "Hasta 30 listados activos",
      "Fotos HD ilimitadas",
      "Soporte prioritario",
      "Listados destacados",
      "Estadísticas de visualización",
      "Herramientas de marketing",
    ],
  },
  {
    name: "Empresarial",
    price: 25000,
    features: [
      "Listados ilimitados",
      "Fotos y videos HD",
      "Soporte 24/7",
      "Listados destacados premium",
      "Análisis avanzado de mercado",
      "API de integración",
      "Página de concesionario personalizada",
      "Herramientas CRM incluidas",
    ],
  },
];

export function DealershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubscriptionForm>();

  const subscription = useMutation({
    mutationFn: async (data: SubscriptionForm & { subscriptionPlan: string }) => {
      const response = await fetch("/api/dealerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to subscribe");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      reset();
      setSelectedPlan(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo procesar la suscripción. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubscriptionForm) => {
    if (!selectedPlan) return;
    subscription.mutate({
      ...data,
      subscriptionPlan: selectedPlan.name,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Planes para Concesionarios</h1>
        <p className="text-xl text-muted-foreground">
          Encuentra el plan perfecto para hacer crecer tu negocio
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative overflow-hidden">
            {plan.name === "Premium" && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg text-sm">
                Más Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-3xl font-bold">
                RD$ {plan.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  /mes
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full mt-6"
                    variant={plan.name === "Premium" ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    Seleccionar Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Suscribirse al Plan {plan.name}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del Concesionario</Label>
                      <Input
                        id="name"
                        {...register("name", { required: true })}
                      />
                      {errors.name && (
                        <span className="text-sm text-destructive">
                          Este campo es requerido
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                      />
                      {errors.email && (
                        <span className="text-sm text-destructive">
                          Este campo es requerido
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        {...register("phone", { required: true })}
                      />
                      {errors.phone && (
                        <span className="text-sm text-destructive">
                          Este campo es requerido
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        {...register("address", { required: true })}
                      />
                      {errors.address && (
                        <span className="text-sm text-destructive">
                          Este campo es requerido
                        </span>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      {subscription.isPending
                        ? "Procesando..."
                        : "Confirmar Suscripción"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
