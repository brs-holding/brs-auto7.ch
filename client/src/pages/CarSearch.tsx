import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import type { CarListing } from "../types/car";

export function CarSearch() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);

  const [make, setMake] = useState<string>(searchParams.get('make') || "all");
  const [model, setModel] = useState<string>(searchParams.get('model') || "all");
  const [year, setYear] = useState<string>(searchParams.get('year') || "all");
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('price') || "all");

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

  // Fetch car listings with filters
  const { data: listings = [], isLoading } = useQuery<CarListing[]>({
    queryKey: ["/api/cars", make, model, year, priceRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (make !== "all") params.append("make", make);
      if (model !== "all") params.append("model", model);
      if (year !== "all") params.append("year", year);
      if (priceRange !== "all") {
        const [min, max] = priceRange.split('-');
        params.append("minPrice", min);
        params.append("maxPrice", max);
      }
      const response = await fetch(`/api/cars?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car listings');
      }
      return response.json();
    }
  });

  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel("all"); // Reset model when make changes

    // Update URL
    const params = new URLSearchParams(location.split('?')[1]);
    if (value !== "all") {
      params.set("make", value);
    } else {
      params.delete("make");
    }
    params.delete("model"); // Remove model param when make changes
    window.history.pushState({}, '', `${location.split('?')[0]}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {make === "all" ? t('search.title') : `${make} ${t('search.title')}`} ({listings.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Make filter */}
        <Select value={make} onValueChange={handleMakeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('search.brand')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.allBrands')}</SelectItem>
            {makes.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model filter */}
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder={t('search.model')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.allModels')}</SelectItem>
            {models.map((modelName) => (
              <SelectItem key={modelName} value={modelName}>
                {modelName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Results */}
        <div className="md:col-span-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8">{t('search.noResults')}</div>
          ) : (
            <div className="space-y-6">
              {listings.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
                    {/* Car Image */}
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {car.images && car.images[0] && (
                        <img
                          src={car.images[0]}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {car.make} {car.model}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>{car.year}</span>
                            <span>•</span>
                            <span>{car.mileage.toLocaleString()} km</span>
                            <span>•</span>
                            <span>{car.transmission}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            CHF {Number(car.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href={`/cars/${car.id}`}>
                          <Button className="w-full">VIEW DETAILS</Button>
                        </Link>
                      </div>

                      {car.dealerName && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <div>{car.dealerName}</div>
                            {car.dealerLocation && <div>{car.dealerLocation}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}