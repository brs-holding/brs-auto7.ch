import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import type { CarListing } from "../types/car";
import { CarCard } from "@/components/CarCard";


export function CarSearch() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);

  const [make, setMake] = useState<string>(searchParams.get('make') || "all");
  const [model, setModel] = useState<string>(searchParams.get('model') || "all");
  const [year, setYear] = useState<string>(searchParams.get('year') || "all");
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('price') || "all");

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {make === "all" ? t('search.title') : make} ({listings.length})
      </h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Results */}
        <div>
          {isLoading ? (
            <div className="text-center py-8">{t('search.loading')}</div>
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