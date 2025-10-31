/*
  Warnings:

  - The values [PENDING,PROCESSING,CONFIRMED,SHIPPED,DELIVERED,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_TRANSIT,DELIVERED,FAILED] on the enum `ShipmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDIENTE', 'PROCESANDO', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ShipmentStatus_new" AS ENUM ('PENDIENTE', 'EN_TRANSITO', 'ENTREGADO', 'FALLIDO');
ALTER TABLE "public"."shipments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "shipments" ALTER COLUMN "status" TYPE "ShipmentStatus_new" USING ("status"::text::"ShipmentStatus_new");
ALTER TYPE "ShipmentStatus" RENAME TO "ShipmentStatus_old";
ALTER TYPE "ShipmentStatus_new" RENAME TO "ShipmentStatus";
DROP TYPE "public"."ShipmentStatus_old";
ALTER TABLE "shipments" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_items" ALTER COLUMN "quantity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "materials" ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "unitPrice" SET DEFAULT 0,
ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE',
ALTER COLUMN "totalAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "shipments" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "comerciantes_ruc_idx" ON "comerciantes"("ruc");

-- CreateIndex
CREATE INDEX "fabricantes_ruc_idx" ON "fabricantes"("ruc");

-- CreateIndex
CREATE INDEX "favorites_comercianteId_idx" ON "favorites"("comercianteId");

-- CreateIndex
CREATE INDEX "favorites_productId_idx" ON "favorites"("productId");

-- CreateIndex
CREATE INDEX "inventory_items_comercianteId_idx" ON "inventory_items"("comercianteId");

-- CreateIndex
CREATE INDEX "inventory_items_productId_idx" ON "inventory_items"("productId");

-- CreateIndex
CREATE INDEX "login_sessions_userId_idx" ON "login_sessions"("userId");

-- CreateIndex
CREATE INDEX "login_sessions_token_idx" ON "login_sessions"("token");

-- CreateIndex
CREATE INDEX "logistica_ruc_idx" ON "logistica"("ruc");

-- CreateIndex
CREATE INDEX "materials_proveedorId_idx" ON "materials"("proveedorId");

-- CreateIndex
CREATE INDEX "materials_category_idx" ON "materials"("category");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "order_items_materialId_idx" ON "order_items"("materialId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_comercianteId_idx" ON "orders"("comercianteId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_fabricanteId_idx" ON "products"("fabricanteId");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_isActive_idx" ON "products"("isActive");

-- CreateIndex
CREATE INDEX "proveedores_ruc_idx" ON "proveedores"("ruc");

-- CreateIndex
CREATE INDEX "shipments_orderId_idx" ON "shipments"("orderId");

-- CreateIndex
CREATE INDEX "shipments_logisticaId_idx" ON "shipments"("logisticaId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_trackingNumber_idx" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
