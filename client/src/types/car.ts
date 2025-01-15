import { z } from 'zod';

export interface CarDetailsType {
  id: number;
  make: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  driveType?: string;
  color?: string;
  interiorColor?: string;
  description?: string;
  features?: string[];
  images?: string[];
  dealerName?: string;
  dealerLocation?: string;
  dealerPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const carSchema = z.object({
  id: z.number(),
  make: z.string(),
  model: z.string(),
  price: z.number(),
  year: z.number(),
  mileage: z.number(),
  fuelType: z.string(),
  transmission: z.string(),
  driveType: z.string().optional(),
  color: z.string().optional(),
  interiorColor: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  dealerName: z.string().optional(),
  dealerLocation: z.string().optional(),
  dealerPhone: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CarType = z.infer<typeof carSchema>;