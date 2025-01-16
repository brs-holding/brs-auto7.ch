import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Heart,
  Scale,
  Star,
  StarHalf,
  Globe,
  MessageSquare,
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
import { useToast } from "@/hooks/use-toast";
import type { Favorite, Comparison } from "@db/schema";

interface Params {
  id: string;
}

interface ExtendedCarListing extends CarListing {
  dealerImage?: string;
  dealerRating?: number;
  dealerWebsite?: string;
}

export function CarDetails() {
  const params = useParams<Params>();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const { toast } = useToast();

  const { data: car, isLoading } = useQuery<ExtendedCarListing>({
    queryKey: ['/api/cars', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/cars/${params.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/favorites/${params.id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update favorite');
      return response.json();
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        duration: 2000,
      });
    }
  });

  const toggleCompare = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/comparisons/${params.id}`, {
        method: isCompared ? 'DELETE' : 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update comparison');
      return response.json();
    },
    onSuccess: () => {
      setIsCompared(!isCompared);
      toast({
        title: isCompared ? "Removed from compare" : "Added to compare",
        duration: 2000,
      });
    }
  });

  const handleMessageDealer = () => {
    // Open message page in new tab
    window.open(`/nachricht-lead/${params.id}`, '_blank');
  };

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
        toast({
          title: "Link copied to clipboard",
          duration: 2000,
        });
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
            <div className="relative w-[700px] h-[525px] mx-auto bg-white rounded-lg overflow-hidden mb-4 group">
              {car?.images && car.images[activeImage] && (
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
                        onClick={() => setActiveImage((prev) => 
                          prev === 0 ? (car.images?.length ?? 1) - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setActiveImage((prev) => 
                          prev === (car.images?.length ?? 1) - 1 ? 0 : prev + 1
                        )}
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
            {car?.images && car.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mb-8 max-w-[700px] mx-auto">
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
              {/* Basic Info */}
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

              {/* Technical Specifications */}
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
              {car?.features && car.features.length > 0 && (
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
              {car?.description && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">{t("car.description")}</h2>
                  <p className="whitespace-pre-wrap text-gray-600">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact and Additional Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">{t("contact.title")}</h2>

              {/* Phone Call Button */}
              {car?.dealerPhone && (
                <Button
                  className="w-full mb-4"
                  onClick={() => window.location.href = `tel:${car.dealerPhone}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {car.dealerPhone}
                </Button>
              )}

              {/* Message Button */}
              <Button
                variant="outline"
                className="w-full mb-6"
                asChild
              >
                <a href={`/nachricht-lead/${params.id}`} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Dealer
                </a>
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite.mutate()}
                  className={`flex-1 ${isFavorite ? 'bg-primary/10' : ''}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-primary' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCompare.mutate()}
                  className={`flex-1 ${isCompared ? 'bg-primary/10' : ''}`}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </div>

              {/* Dealer Info */}
              <div className="space-y-4">
                {car?.dealerName && (
                  <div className="flex items-center gap-4">
                    {car.dealerImage && (
                      <img
                        src={car.dealerImage}
                        alt={car.dealerName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{car.dealerName}</h3>
                      {car.dealerRating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => {
                            const rating = car.dealerRating || 0;
                            if (i + 1 <= Math.floor(rating)) {
                              return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                            } else if (i + 0.5 <= rating) {
                              return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                            }
                            return <Star key={i} className="h-4 w-4 text-gray-300" />;
                          })}
                          <span className="text-sm text-gray-600 ml-1">({rating})</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {car?.dealerWebsite && (
                  <a
                    href={car.dealerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-primary hover:underline"
                  >
                    <Globe className="h-5 w-5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={showZoomDialog} onOpenChange={setShowZoomDialog}>
        <DialogContent className="max-w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{car?.make} {car?.model}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full">
            {car?.images && car.images[activeImage] && (
              <img
                src={car.images[activeImage]}
                alt={`${car.make} {car.model}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {car?.images && car.images.length > 1 && (
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
                    alt={`${car.make} {car.model} view ${index + 1}`}
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