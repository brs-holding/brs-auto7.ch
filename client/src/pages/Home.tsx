import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Truck, Bike, CaravanIcon, Search } from "lucide-react";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  const [brand, setBrand] = useState("all");
  const [model, setModel] = useState("all");
  const [year, setYear] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Fetch car makes
  const { data: makes = [] } = useQuery<string[]>({
    queryKey: ["/api/car-makes"],
    queryFn: async () => {
      const response = await fetch("/api/car-makes");
      if (!response.ok) {
        throw new Error("Failed to fetch car makes");
      }
      return response.json();
    },
  });

  // Fetch models for selected brand
  const { data: models = [] } = useQuery<string[]>({
    queryKey: ["/api/car-models", brand],
    queryFn: async () => {
      if (brand === "all") return [];
      const response = await fetch(`/api/car-models/${brand}`);
      if (!response.ok) {
        throw new Error("Failed to fetch car models");
      }
      return response.json();
    },
    enabled: brand !== "all",
  });

  // Generate years from 1990 to current year
  const years = Array.from(
    { length: 2025 - 1990 + 1 },
    (_, i) => (2025 - i).toString()
  );

  const priceRanges = [
    { label: t("home.price.under50k"), value: "0-50000" },
    { label: t("home.price.50kTo100k"), value: "50000-100000" },
    { label: t("home.price.100kTo200k"), value: "100000-200000" },
    { label: t("home.price.over200k"), value: "200000-999999999" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand && brand !== "all") params.append("make", brand);
    if (model && model !== "all") params.append("model", model);
    if (year && year !== "all") params.append("year", year);
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split("-");
      params.append("minPrice", min);
      params.append("maxPrice", max);
    }
    window.location.href = `/search?${params.toString()}`;
  };

  // Reset model when brand changes
  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel("all");
  };

  return (
    <div className="flex flex-col">
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
              {t("home.new")}
            </span>
            <span className="font-semibold">{t("home.directSelling")}</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{t("home.mainHeading")}</h1>
          <p className="text-muted-foreground mb-6">{t("home.freeService")}</p>

          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={brand} onValueChange={handleBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("home.brand")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("home.allBrands")}</SelectItem>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("home.model")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("home.allModels")}</SelectItem>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("home.year")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("home.allYears")}</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("home.price")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("home.allPrices")}</SelectItem>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full md:col-span-4" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  {t("home.search")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
            {[
              { type: "car", icon: Car, label: t("category.cars") },
              { type: "suv", icon: Car, label: t("category.suv") },
              { type: "truck", icon: Truck, label: t("category.trucks") },
              { type: "motorcycle", icon: Bike, label: t("category.motorcycles") },
              { type: "van", icon: CaravanIcon, label: t("category.vans") },
            ].map(({ type, icon: Icon, label }) => (
              <Link key={type} href={`/search?type=${type}`}>
                <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                  <Icon className="h-8 w-8 mb-2" />
                  <span className="text-sm">{label}</span>
                </a>
              </Link>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t("home.whyAuto7")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Search className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{t("home.easySearch")}</h3>
                  <p>{t("home.easySearchDescription")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/shield-check.svg" alt="Qualitätsgarantie" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{t("home.qualityGuarantee")}</h3>
                  <p>{t("home.qualityGuaranteeDescription")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/dollar-sign.svg" alt="Finanzierung" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{t("home.financing")}</h3>
                  <p>{t("home.financingDescription")}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calculator Section */}
          <section className="py-16 bg-muted mt-16">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                {t("home.calculateFinancing")}
              </h2>
              <FinanceCalculator />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}