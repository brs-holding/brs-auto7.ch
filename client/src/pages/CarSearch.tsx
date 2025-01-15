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

  const [brand, setBrand] = useState(searchParams.get('brand') || "all");
  const [year, setYear] = useState(searchParams.get('year') || "all");
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || "all");

  // Fetch car listings with filters
  const { data: listings, isLoading } = useQuery<CarListing[]>({
    queryKey: ["/api/cars", brand, year, priceRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (brand !== "all") params.append("make", brand);
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

  // Get unique brands and years from the listings
  const brands = Array.from(new Set(listings?.map((listing) => listing.make) || [])).sort();
  const years = Array.from(
    new Set(listings?.map((listing) => listing.year.toString()) || [])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const priceRanges = [
    { label: "Bis CHF 50'000", value: "0-50000" },
    { label: "CHF 50'000 - 100'000", value: "50000-100000" },
    { label: "CHF 100'000 - 200'000", value: "100000-200000" },
    { label: "Über CHF 200'000", value: "200000-999999999" },
  ];

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
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder={t('search.brand')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allBrands')}</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('search.year')}</Label>
            <Select value={year} onValueChange={setYear}>
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
            <Select value={priceRange} onValueChange={setPriceRange}>
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