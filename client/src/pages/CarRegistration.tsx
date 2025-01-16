import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Upload, X } from "lucide-react";

// Updated schema to match the new layout requirements
const carRegistrationSchema = z.object({
  make: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  price: z.number().min(1, "Price is required"),
  year: z.number().min(1900, "Year is required"),
  mileage: z.number().min(0, "Mileage is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  driveType: z.string().min(1, "Drive type is required"),
  color: z.string().min(1, "Color is required"),
  bodyType: z.string().min(1, "Body type is required"),
  doors: z.number().min(1, "Number of doors is required"),
  seats: z.number().min(1, "Number of seats is required"),
  power: z.number().min(1, "Engine power is required"),
  engineSize: z.number().min(0.1, "Engine size is required"),
  acceleration: z.number().min(0, "Acceleration is required"),
  topSpeed: z.number().min(0, "Top speed is required"),
  co2Emissions: z.number().min(0, "CO2 emissions is required"),
  fuelConsumption: z.object({
    city: z.number().min(0, "City consumption is required"),
    highway: z.number().min(0, "Highway consumption is required"),
    combined: z.number().min(0, "Combined consumption is required"),
  }),
  features: z.array(z.string()),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  dealerInfo: z.object({
    name: z.string().min(1, "Dealer name is required"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
  }),
});

type CarRegistrationForm = z.infer<typeof carRegistrationSchema>;

const bodyTypes = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Van",
  "Pickup",
];

const fuelTypes = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
  "Natural Gas",
];

const transmissionTypes = [
  "Automatic",
  "Manual",
  "Semi-Automatic",
  "CVT",
];

const driveTypes = [
  "Front-wheel drive",
  "Rear-wheel drive",
  "All-wheel drive",
  "Four-wheel drive",
];

const commonFeatures = [
  "Air Conditioning",
  "Navigation System",
  "Leather Seats",
  "Sunroof",
  "Parking Sensors",
  "Backup Camera",
  "Bluetooth",
  "Cruise Control",
  "Heated Seats",
  "LED Headlights",
];

export function CarRegistration() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user } = useUser();

  // Fetch available car makes
  const { data: makes = [] } = useQuery<string[]>({
    queryKey: ["/api/car-makes"],
  });

  const form = useForm<CarRegistrationForm>({
    resolver: zodResolver(carRegistrationSchema),
    defaultValues: {
      make: "",
      model: "",
      price: 0,
      year: new Date().getFullYear(),
      mileage: 0,
      fuelType: "",
      transmission: "",
      driveType: "",
      color: "",
      bodyType: "",
      doors: 4,
      seats: 5,
      power: 0,
      engineSize: 0,
      acceleration: 0,
      topSpeed: 0,
      co2Emissions: 0,
      fuelConsumption: {
        city: 0,
        highway: 0,
        combined: 0,
      },
      features: [],
      description: "",
      images: [],
      dealerInfo: {
        name: "",
        phone: "",
        location: "",
      },
    },
  });

  const registerCar = useMutation({
    mutationFn: async (data: CarRegistrationForm) => {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register car');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Your car has been registered successfully",
      });
      navigate(`/cars/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, ...base64Images]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CarRegistrationForm) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register a car",
        variant: "destructive",
      });
      return;
    }
    registerCar.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Register Your Car</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {makes.map((make) => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. X5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (CHF)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 25000" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2023" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Alpine White" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Technical Specifications</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 50000" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Size (L)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 2.0" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="power"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power (HP)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 250" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceleration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceleration 0-100 km/h (s)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 6.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transmissionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drive Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select drive type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {driveTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fuelConsumption.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Consumption (L/100km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 8.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelConsumption.highway"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highway Consumption (L/100km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 6.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelConsumption.combined"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combined Consumption (L/100km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 7.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="co2Emissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CO2 Emissions (g/km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 150" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={feature}
                    onChange={(e) => {
                      const currentFeatures = form.getValues("features");
                      if (e.target.checked) {
                        form.setValue("features", [...currentFeatures, feature]);
                      } else {
                        form.setValue(
                          "features",
                          currentFeatures.filter((f) => f !== feature)
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={feature} className="text-sm">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Images</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {form.watch("images").map((image, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                  <Upload className="h-4 w-4" />
                  Upload Images
                </div>
              </label>
              <FormMessage />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your car..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dealer Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Dealer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dealerInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dealer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter dealer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealerInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dealerInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={registerCar.isPending}
          >
            {registerCar.isPending ? "Registering..." : "Register Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}