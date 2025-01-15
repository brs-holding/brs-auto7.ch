import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarListing } from "@db/schema";
import { useTranslation } from "react-i18next";

interface CarCardProps {
  listing: CarListing;
}

export function CarCard({ listing }: CarCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted h-48 flex items-center justify-center">
        <img
          src="/car-placeholder.svg"
          alt={`${listing.make} ${listing.model}`}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">
          {listing.make} {listing.model} {listing.year}
        </h3>
        <div className="mt-2 space-y-1">
          <p className="text-xl font-bold text-primary">
            CHF {Number(listing.price).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {listing.mileage.toLocaleString()} km • {listing.transmission} • {listing.fuelType}
          </p>
        </div>
        <div className="mt-2">
          {listing.features && listing.features.length > 0 && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.features.join(", ")}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">{t('car.viewDetails', 'View Details')}</Button>
      </CardFooter>
    </Card>
  );
}