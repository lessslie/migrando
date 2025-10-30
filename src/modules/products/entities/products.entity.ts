// src/modules/products/entities/products.entity.ts
import { Decimal } from '@prisma/client/runtime/library';
import { IDimensions, IProduct } from '../interfaces/products.interface';

export class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  price: number | Decimal;
  currency: string;
  category: string;
  subcategory?: string;
  sku: string;
  stock: number;
  images: string[];
  materials: string[] = [];
  dimensions?: IDimensions;
  weight?: number;
  weightUnit?: string;
  minOrderQuantity?: number;
  leadTime?: number;
  customizable?: boolean;
  sustainabilityCertifications?: string[];
  tags?: string[];
  isActive: boolean = true;
  fabricanteId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
    // Convertir Decimal a number si es necesario
    if (this.price && typeof this.price !== 'number') {
      this.price = Number(this.price);
    }
    // Asegurar que materials sea un array
    if (!this.materials) {
      this.materials = [];
    }
    // Valor por defecto para isActive
    if (this.isActive === undefined) {
      this.isActive = true;
    }
  }
}