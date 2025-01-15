import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const { t } = useTranslation();
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("Personenwagen");
  const [make, setMake] = useState<string>("all");
  const [model, setModel] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  // Fetch available car makes
  const { data: makes = [] } = useQuery<string[]>({
    queryKey: ["/api/car-makes"],
    queryFn: async () => {
      const response = await fetch("/api/car-makes");
      if (!response.ok) {
        throw new Error('Failed to fetch car makes');
      }
      return response.json();
    }
  });

  // Fetch models for selected make
  const { data: models = [] } = useQuery<string[]>({
    queryKey: ["/api/car-models", make],
    queryFn: async () => {
      if (make === "all") return [];
      const response = await fetch(`/api/car-models/${make}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car models');
      }
      return response.json();
    },
    enabled: make !== "all"
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make !== "all") params.append("make", make);
    if (model !== "all") params.append("model", model);
    if (year !== "all") params.append("year", year);
    window.location.href = `/search?${params.toString()}`;
  };

  const vehicleTypes = [
    { id: "Personenwagen", label: "Personenwagen", icon: "🚗" },
    { id: "Wohnmobil", label: "Wohnmobil", icon: "🚐" },
    { id: "Nutzfahrzeug", label: "Nutzfahrzeug", icon: "🚛" },
    { id: "Lastwagen", label: "Lastwagen", icon: "🚚" },
    { id: "Anhänger", label: "Anhänger", icon: "🚍" },
    { id: "Motorrad", label: "Motorrad", icon: "🏍" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Finde die <span className="text-[#00b1e6]">besten</span> Auto-Kredite
          </h1>
          <p className="text-2xl mb-8">
            Niedrige Zinsen, sicher jederzeit ablösbar
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-[#e6f7fc]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-lg">
              Suche in <span className="font-bold">170'073</span> Fahrzeugen
            </p>
          </div>

          {/* Vehicle Type Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {vehicleTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedVehicleType === type.id ? "default" : "ghost"}
                onClick={() => setSelectedVehicleType(type.id)}
                className="flex flex-col items-center gap-2 h-auto py-4 px-6"
              >
                <span className="text-2xl">{type.icon}</span>
                <span>{type.label}</span>
              </Button>
            ))}
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Marken" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Marken</SelectItem>
                  {makes.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={model} 
                onValueChange={setModel}
                disabled={make === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle Modelle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Modelle</SelectItem>
                  {models.map((modelName) => (
                    <SelectItem key={modelName} value={modelName}>{modelName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Jahre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Jahre</SelectItem>
                  {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (
                    <SelectItem key={2025 - i} value={(2025 - i).toString()}>
                      {2025 - i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full md:col-span-4"
                size="lg"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Suchen
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}