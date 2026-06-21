export interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  vehicleId: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color?: string | null;
  engine?: string | null;
  description?: string | null;
  status: string;
  featured: boolean;
  images: VehicleImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  status?: string;
}
