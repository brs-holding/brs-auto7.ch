import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Palette,
  LayoutList,
  User,
  Phone,
  MapPin,
  Share2,
  ChevronRight,
  ZoomIn,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { CarListing } from "../types/car";

interface Params {
  id: string;
}

export function CarDetails() {
  const params = useParams<Params>();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [showZoomDialog, setShowZoomDialog] = useState(false);

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

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = `${car?.make} ${car?.model} - Auto7.ch`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        // You might want to show a toast notification here
        break;
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/">
              <a className="hover:text-primary">{t("nav.home")}</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/search">
              <a className="hover:text-primary">{t("nav.vehicles")}</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">{car.make} {car.model}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden mb-4 group">
              {car.images && car.images[activeImage] && (
                <>
                  <img 
                    src={car.images[activeImage]} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setShowZoomDialog(true)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  {car.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setActiveImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mb-8">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-[4/3] rounded-md overflow-hidden border-2 transition-colors ${
                      index === activeImage ? 'border-primary' : 'border-transparent hover:border-gray-300'
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

            {/* Car Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {car.make} {car.model}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">{car.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary">
                      CHF {Number(car.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Tweet
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Key Specifications */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{t("car.specifications")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.year")}</p>
                      <p className="font-medium">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.mileage")}</p>
                      <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.fuelType")}</p>
                      <p className="font-medium">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cog className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">{t("car.transmission")}</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                  </div>
                  {car.driveType && (
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{t("car.driveType")}</p>
                        <p className="font-medium">{car.driveType}</p>
                      </div>
                    </div>
                  )}
                  {car.color && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{t("car.color")}</p>
                        <p className="font-medium">{car.color}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">{t("car.features")}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">{t("car.description")}</h2>
                  <p className="whitespace-pre-wrap text-gray-600">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact and Additional Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">{t("contact.title")}</h2>

              {/* Dealer Info */}
              {car.dealerName && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>{car.dealerName}</span>
                  </div>
                  {car.dealerLocation && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{car.dealerLocation}</span>
                    </div>
                  )}
                  {car.dealerPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <a 
                        href={`tel:${car.dealerPhone}`}
                        className="text-primary hover:underline"
                      >
                        {car.dealerPhone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Form */}
              <form className="space-y-4">
                <Input placeholder={t("contact.name")} />
                <Input type="email" placeholder={t("contact.email")} />
                <Input type="tel" placeholder={t("contact.phone")} />
                <Textarea 
                  placeholder={t("contact.message")}
                  rows={4}
                  defaultValue={`I am interested in the ${car.make} ${car.model} (${car.year}).`}
                />
                <Button className="w-full">{t("contact.send")}</Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={showZoomDialog} onOpenChange={setShowZoomDialog}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>{car.make} {car.model}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            {car.images && car.images[activeImage] && (
              <img
                src={car.images[activeImage]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {car.images && car.images.length > 1 && (
            <div className="grid grid-cols-8 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-[4/3] rounded-md overflow-hidden border-2 ${
                    index === activeImage ? 'border-primary' : 'border-transparent'
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
        </DialogContent>
      </Dialog>
    </div>
  );
}