import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Car } from "@db/schema";

export function CarSearch() {
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [brand, setBrand] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const filteredCars = cars?.filter((car) => {
    const matchesSearch = search 
      ? `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesBrand = brand ? car.brand === brand : true;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const brands = Array.from(new Set(cars?.map((car) => car.brand) || []));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buscar Carros</h1>

      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div>
            <Label>Buscar</Label>
            <Input
              placeholder="Marca o modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <Label>Marca</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las marcas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Rango de Precio (RD$)</Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={5000000}
              step={50000}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>RD$ {priceRange[0].toLocaleString()}</span>
              <span>RD$ {priceRange[1].toLocaleString()}</span>
            </div>
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
