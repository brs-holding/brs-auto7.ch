import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

interface CarListing {
  id: number;
  listingId: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  driveType: string;
  features: string[] | null;
  dealershipName: string | null;
  dealershipAddress: string | null;
  dealershipPhone: string | null;
  make: string;
  model: string;
}

export function CarSearch() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);

  // Initialize state with URL parameters
  const [make, setMake] = useState(searchParams.get('make') || "all");
  const [model, setModel] = useState(searchParams.get('model') || "all");
  const [year, setYear] = useState(searchParams.get('year') || "all");
  const [priceRange, setPriceRange] = useState(
    searchParams.get('minPrice') && searchParams.get('maxPrice') 
      ? `${searchParams.get('minPrice')}-${searchParams.get('maxPrice')}`
      : "all"
  );

  // Fetch car makes
  const { data: makes = [] } = useQuery({
    queryKey: ["/api/car-makes"],
    queryFn: async () => {
      const response = await fetch("/api/car-makes");
      if (!response.ok) throw new Error("Failed to fetch car makes");
      return response.json();
    },
  });

  // Fetch models for selected make
  const { data: models = [] } = useQuery({
    queryKey: ["/api/car-models", make],
    queryFn: async () => {
      if (make === "all") return [];
      const response = await fetch(`/api/car-models/${make}`);
      if (!response.ok) throw new Error("Failed to fetch car models");
      return response.json();
    },
    enabled: make !== "all",
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

  // Update URL when filters change
  const updateUrl = (newMake?: string, newModel?: string, newYear?: string, newPriceRange?: string) => {
    const params = new URLSearchParams();
    if ((newMake || make) !== "all") params.append("make", newMake || make);
    if ((newModel || model) !== "all") params.append("model", newModel || model);
    if ((newYear || year) !== "all") params.append("year", newYear || year);
    if ((newPriceRange || priceRange) !== "all") {
      const [min, max] = (newPriceRange || priceRange).split('-');
      params.append("minPrice", min);
      params.append("maxPrice", max);
    }
    window.history.replaceState(null, '', `/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {t('search.title')} ({listings?.length || 0})
      </h1>

      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div>
            <Label>{t('search.brand')}</Label>
            <Select 
              value={make} 
              onValueChange={(value) => {
                setMake(value);
                setModel("all"); // Reset model when make changes
                updateUrl(value, "all");
              }}
            >
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
          </div>

          <div>
            <Label>{t('search.model')}</Label>
            <Select 
              value={model} 
              onValueChange={(value) => {
                setModel(value);
                updateUrl(undefined, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('search.model')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allModels')}</SelectItem>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('search.year')}</Label>
            <Select 
              value={year} 
              onValueChange={(value) => {
                setYear(value);
                updateUrl(undefined, undefined, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('search.year')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allYears')}</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('search.priceRange')}</Label>
            <Select 
              value={priceRange} 
              onValueChange={(value) => {
                setPriceRange(value);
                updateUrl(undefined, undefined, undefined, value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('search.priceRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allPrices')}</SelectItem>
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
            <div className="text-center">{t('search.loading', 'Loading...')}</div>
          ) : listings?.length === 0 ? (
            <div className="text-center">{t('search.noResults')}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings?.map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}