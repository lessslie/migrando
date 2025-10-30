// src/modules/products/interfaces/products.interface.ts
import { Decimal } from '@prisma/client/runtime/library';

export interface IDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number | Decimal;  // Updated to accept both number and Decimal
  currency: string;
  category: string;
  subcategory?: string;
  sku: string;
  stock: number;
  images: string[];
  materials: string[];
  dimensions?: IDimensions;
  weight?: number;
  weightUnit?: string;
  minOrderQuantity?: number;
  leadTime?: number;
  customizable?: boolean;
  sustainabilityCertifications?: string[];
  tags?: string[];
  isActive: boolean;
  fabricanteId: string;
  createdAt: Date;
  updatedAt: Date;
}