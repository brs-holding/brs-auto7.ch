import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "@db/schema";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={car.imageUrl}
        alt={`${car.brand} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model} {car.year}
        </h3>
        <div className="mt-2 space-y-1">
          <p className="text-xl font-bold text-primary">
            RD$ {car.price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {car.mileage.toLocaleString()} km
          </p>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{car.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Ver Detalles</Button>
      </CardFooter>
    </Card>
  );
}
