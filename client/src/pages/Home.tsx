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
import { Car as CarType } from "@db/schema";

export function Home() {
  const [brand, setBrand] = useState("all");
  const [year, setYear] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: cars } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const brands = Array.from(new Set(cars?.map((car) => car.brand) || [])).sort();
  const years = Array.from(
    new Set(cars?.map((car) => car.year.toString()) || [])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const priceRanges = [
    { label: "Hasta RD$ 500,000", value: "0-500000" },
    { label: "RD$ 500,000 - 1,000,000", value: "500000-1000000" },
    { label: "RD$ 1,000,000 - 2,000,000", value: "1000000-2000000" },
    { label: "Más de RD$ 2,000,000", value: "2000000-999999999" },
  ];

  const totalCars = cars?.length || 0;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand && brand !== "all") params.append("brand", brand);
    if (year && year !== "all") params.append("year", year);
    if (priceRange && priceRange !== "all") params.append("price", priceRange);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      {/* Search Section */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          {/* AutoCarrosRD Direct Banner */}
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NUEVO</span>
            <span className="font-semibold">AutosRD Direct</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Vende tu carro seguro y rápido a un dealer
          </h1>
          <p className="text-muted-foreground mb-6">100% gratis</p>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Marca & Modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los años</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  {totalCars.toLocaleString()} Resultados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            <Link href="/search?type=car">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Car className="h-8 w-8 mb-2" />
                <span className="text-sm">Vehículos</span>
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
                <span className="text-sm">Camiones</span>
              </a>
            </Link>
            <Link href="/search?type=motorcycle">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <Bike className="h-8 w-8 mb-2" />
                <span className="text-sm">Motocicletas</span>
              </a>
            </Link>
            <Link href="/search?type=van">
              <a className="flex flex-col items-center p-4 hover:bg-muted rounded-lg transition-colors">
                <CaravanIcon className="h-8 w-8 mb-2" />
                <span className="text-sm">Vans</span>
              </a>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">¿Por qué CarrosRD?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Search className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Búsqueda Fácil</h3>
                  <p>Encuentra el carro perfecto con nuestros filtros avanzados</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/shield-check.svg" alt="Garantía de Calidad" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Garantía de Calidad</h3>
                  <p>Todos los vehículos son verificados por expertos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <img src="/dollar-sign.svg" alt="Financiamiento" className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Financiamiento</h3>
                  <p>Opciones flexibles de financiamiento adaptadas a ti</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calculator Section */}
          <section className="py-16 bg-muted mt-16">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Calcula Tu Financiamiento
              </h2>
              <FinanceCalculator />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}