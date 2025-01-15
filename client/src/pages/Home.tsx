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
import { CarModel } from "@db/schema";

export function Home() {
  const [brand, setBrand] = useState("all");
  const [model, setModel] = useState("all");
  const [year, setYear] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: carModels } = useQuery<CarModel[]>({
    queryKey: ["/api/car-models"],
  });

  // Sort makes alphabetically
  const brands = Array.from(new Set(carModels?.map((model) => model.make) || []))
    .sort((a, b) => a.localeCompare(b));

  // Filter and sort models alphabetically for the selected make
  const models = carModels
    ?.filter((carModel) => brand === "all" || carModel.make === brand)
    .map((carModel) => carModel.model)
    .sort((a, b) => a.localeCompare(b)) || [];

  const years = Array.from(
    new Set(Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (2025 - i).toString()))
  );

  const priceRanges = [
    { label: "Bis RD$ 500.000", value: "0-500000" },
    { label: "RD$ 500.000 - 1.000.000", value: "500000-1000000" },
    { label: "RD$ 1.000.000 - 2.000.000", value: "1000000-2000000" },
    { label: "Über RD$ 2.000.000", value: "2000000-999999999" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand && brand !== "all") params.append("brand", brand);
    if (model && model !== "all") params.append("model", model);
    if (year && year !== "all") params.append("year", year);
    if (priceRange && priceRange !== "all") params.append("price", priceRange);
    window.location.href = `/search?${params.toString()}`;
  };

  // Reset model when brand changes
  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel("all");
  };

  return (
    <div className="flex flex-col">
      {/* Search Section */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          {/* AutoCarrosRD Direct Banner */}
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NEU</span>
            <span className="font-semibold">AutosRD Direkt</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Verkaufen Sie Ihr Auto sicher und schnell an einen Händler
          </h1>
          <p className="text-muted-foreground mb-6">100% kostenlos</p>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={brand} onValueChange={handleBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Marke" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Marken</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Modell" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Modelle</SelectItem>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jahr" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Jahre</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Preis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Preise</SelectItem>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Suchen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            <Link href="/search?type=car">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm">Autos</span>
              </a>
            </Link>
            <Link href="/search?type=suv">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm">SUV</span>
              </a>
            </Link>
            <Link href="/search?type=truck">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Truck className="h-8 w-8 mb-2" />
                <span className="text-sm">Lastwagen</span>
              </a>
            </Link>
            <Link href="/search?type=motorcycle">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Bike className="h-8 w-8 mb-2" />
                <span className="text-sm">Motorräder</span>
              </a>
            </Link>
            <Link href="/search?type=van">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <CaravanIcon className="h-8 w-8 mb-2" />
                <span className="text-sm">Transporter</span>
              </a>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Warum AutosRD?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Search className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Einfache Suche</h3>
                  <p>Finden Sie das perfekte Auto mit unseren erweiterten Filtern</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/shield-check.svg" alt="Qualitätsgarantie" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Qualitätsgarantie</h3>
                  <p>Alle Fahrzeuge werden von Experten geprüft</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/dollar-sign.svg" alt="Finanzierung" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Finanzierung</h3>
                  <p>Flexible Finanzierungsoptionen nach Ihren Bedürfnissen</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calculator Section */}
          <section className="py-16 bg-muted mt-16">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Berechnen Sie Ihre Finanzierung
              </h2>
              <FinanceCalculator />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}