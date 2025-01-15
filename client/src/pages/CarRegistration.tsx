import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Upload, X } from "lucide-react";

const carRegistrationSchema = z.object({
  make: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  price: z.string().min(1, "Price is required").transform(Number),
  year: z.string().min(1, "Year is required").transform(Number),
  mileage: z.string().min(1, "Mileage is required").transform(Number),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  driveType: z.string().min(1, "Drive type is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type CarRegistrationForm = z.infer<typeof carRegistrationSchema>;

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
      price: "",
      year: new Date().getFullYear().toString(),
      mileage: "",
      fuelType: "",
      transmission: "",
      driveType: "",
      color: "",
      description: "",
      images: [],
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
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your car has been registered successfully",
      });
      navigate("/");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (CHF)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 25000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (
                        <SelectItem key={2025 - i} value={(2025 - i).toString()}>
                          {2025 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                      {["Petrol", "Diesel", "Electric", "Hybrid"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
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
                      {["Automatic", "Manual"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Images</FormLabel>
            <div className="flex flex-wrap gap-4 mb-4">
              {form.watch("images").map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Car image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your car..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={registerCar.isPending}>
            {registerCar.isPending ? "Registering..." : "Register Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}