import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { Car } from "@db/schema";

export function CarSearch() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);

  const [brand, setBrand] = useState(searchParams.get('brand') || "all");
  const [year, setYear] = useState(searchParams.get('year') || "all");
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || "all");

  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const filteredCars = cars?.filter((car) => {
    const matchesBrand = brand === "all" || car.brand === brand;
    const matchesYear = year === "all" || car.year.toString() === year;

    let matchesPrice = true;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(Number);
      const price = Number(car.price);
      matchesPrice = price >= min && price <= max;
    }

    return matchesBrand && matchesYear && matchesPrice;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {filteredCars?.length.toLocaleString()} Vehículos Encontrados
      </h1>

      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div>
            <Label>Marca</Label>
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
          </div>

          <div>
            <Label>Año</Label>
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
          </div>

          <div>
            <Label>Rango de Precio</Label>
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
          </div>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="text-center">Cargando...</div>
          ) : filteredCars?.length === 0 ? (
            <div className="text-center">No se encontraron resultados</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars?.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}