import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  CarIcon,
  CalendarIcon,
  GaugeIcon,
  FuelIcon,
  CogIcon,
  PaletteIcon,
  LayoutListIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react";
import type { CarListing } from "../types/car";

interface Params {
  id: string;
}

export function CarDetails() {
  const params = useParams<Params>();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);

  const { data: car, isLoading } = useQuery<CarListing>({
    queryKey: ['/api/cars', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/cars/${params.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-600">{t("error.notFound")}</h1>
        <Link href="/search">
          <Button className="mt-4">{t("search.title")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images and Basic Info */}
        <div>
          <div className="relative aspect-[4/3] bg-gray-100 mb-4 rounded-lg overflow-hidden">
            {car.images && car.images[activeImage] && (
              <img 
                src={car.images[activeImage]} 
                alt={`${car.make} ${car.model}`} 
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {car.images && car.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mb-4">
              {car.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-[4/3] rounded-md overflow-hidden ${
                    index === activeImage ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.make} ${car.model} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              {car.make} {car.model}
            </h1>
            <p className="text-4xl font-bold text-primary">
              CHF {Number(car.price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Column - Car Details */}
        <div className="space-y-8">
          {/* Basic Data */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("car.basicData")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("car.year")}</p>
                  <p className="font-medium">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GaugeIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("car.mileage")}</p>
                  <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FuelIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("car.fuelType")}</p>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CogIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("car.transmission")}</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Colors */}
          {(car.color || car.interiorColor) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("car.colors")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {car.color && (
                  <div className="flex items-center gap-2">
                    <PaletteIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.exteriorColor")}</p>
                      <p className="font-medium">{car.color}</p>
                    </div>
                  </div>
                )}
                {car.interiorColor && (
                  <div className="flex items-center gap-2">
                    <PaletteIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.interiorColor")}</p>
                      <p className="font-medium">{car.interiorColor}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("car.features")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <LayoutListIcon className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Description */}
          {car.description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("car.description")}
              </h2>
              <p className="whitespace-pre-wrap">{car.description}</p>
            </Card>
          )}

          {/* Dealer Info & Contact Form */}
          <Card className="p-6">
            {car.dealerName && (
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span>{car.dealerName}</span>
                </div>
                {car.dealerLocation && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <span>{car.dealerLocation}</span>
                  </div>
                )}
                {car.dealerPhone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-gray-500" />
                    <a href={`tel:${car.dealerPhone}`} className="text-primary hover:underline">
                      {car.dealerPhone}
                    </a>
                  </div>
                )}
              </div>
            )}

            <form className="space-y-4">
              <Input placeholder={t("contact.name")} />
              <Input type="email" placeholder={t("contact.email")} />
              <Input type="tel" placeholder={t("contact.phone")} />
              <Textarea placeholder={t("contact.message")} rows={4} />
              <Button className="w-full">{t("contact.send")}</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}