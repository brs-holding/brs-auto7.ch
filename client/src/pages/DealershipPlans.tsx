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
import { useTranslation } from "react-i18next";

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
    name: "Basis",
    price: 500,
    features: [
      "Bis zu 10 aktive Anzeigen",
      "Basis-Fotos pro Fahrzeug",
      "E-Mail-Support",
      "30 Tage Anzeigenlaufzeit",
    ],
  },
  {
    name: "Premium",
    price: 1200,
    features: [
      "Bis zu 30 aktive Anzeigen",
      "Unbegrenzte HD-Fotos",
      "Prioritäts-Support",
      "Hervorgehobene Anzeigen",
      "Zugriffsstatistiken",
      "Marketing-Tools",
    ],
  },
  {
    name: "Business",
    price: 2500,
    features: [
      "Unbegrenzte Anzeigen",
      "HD-Fotos und Videos",
      "24/7 Support",
      "Premium hervorgehobene Anzeigen",
      "Erweiterte Marktanalyse",
      "API-Integration",
      "Individuelle Händlerseite",
      "CRM-Tools inklusive",
    ],
  },
];

export function DealershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
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
        title: t("plans.success"),
        description: t("plans.successMessage"),
      });
      reset();
      setSelectedPlan(null);
    },
    onError: () => {
      toast({
        title: t("plans.error"),
        description: t("plans.errorMessage"),
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
        <h1 className="text-4xl font-bold mb-4">{t("plans.title")}</h1>
        <p className="text-xl text-muted-foreground">
          {t("plans.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative overflow-hidden">
            {plan.name === "Premium" && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg text-sm">
                {t("plans.mostPopular")}
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-3xl font-bold">
                CHF {plan.price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  {t("plans.monthly")}
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
                    {t("plans.selectPlan")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {t("plans.registration")} {plan.name}
                      {t("plans.package")}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t("plans.dealershipName")}</Label>
                      <Input
                        id="name"
                        {...register("name", { required: true })}
                      />
                      {errors.name && (
                        <span className="text-sm text-destructive">
                          {t("plans.required")}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">{t("plans.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                      />
                      {errors.email && (
                        <span className="text-sm text-destructive">
                          {t("plans.required")}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("plans.phone")}</Label>
                      <Input
                        id="phone"
                        {...register("phone", { required: true })}
                      />
                      {errors.phone && (
                        <span className="text-sm text-destructive">
                          {t("plans.required")}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">{t("plans.address")}</Label>
                      <Input
                        id="address"
                        {...register("address", { required: true })}
                      />
                      {errors.address && (
                        <span className="text-sm text-destructive">
                          {t("plans.required")}
                        </span>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      {subscription.isPending
                        ? t("plans.processing")
                        : t("plans.confirm")}
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