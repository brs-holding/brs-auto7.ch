import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, X, Car, User, Globe } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarModel } from "@db/schema";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [make, setMake] = useState("all");
  const [model, setModel] = useState("all");
  const [year, setYear] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [, setLocation] = useLocation();

  const { data: carModels } = useQuery<CarModel[]>({
    queryKey: ["/api/car-models"],
  });

  const makes = Array.from(new Set(carModels?.map((model) => model.make) || [])).sort();
  const models = carModels
    ?.filter((model) => make === "all" || model.make === make)
    .map((model) => model.model) || [];

  const years = Array.from(
    new Set(
      Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (2025 - i).toString())
    )
  );

  const priceRanges = [
    { label: "Hasta RD$ 500,000", value: "0-500000" },
    { label: "RD$ 500,000 - 1,000,000", value: "500000-1000000" },
    { label: "RD$ 1,000,000 - 2,000,000", value: "1000000-2000000" },
    { label: "Más de RD$ 2,000,000", value: "2000000-999999999" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make && make !== "all") params.append("make", make);
    if (model && model !== "all") params.append("model", model);
    if (year && year !== "all") params.append("year", year);
    if (priceRange && priceRange !== "all") params.append("price", priceRange);
    setLocation(`/search?${params.toString()}`);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary mr-8">CarrosRD</a>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Globe className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>

        {/* Search Bar */}
        <div className="py-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los modelos</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
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

            <Button onClick={handleSearch} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
              154'200 Resultados
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/search">
                <a className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-md">
                  <Car className="h-4 w-4 mr-2" />
                  Vehículos
                </a>
              </Link>
              <Link href="/dealerships">
                <a className="px-4 py-2 hover:bg-gray-100 rounded-md">Concesionarios</a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}