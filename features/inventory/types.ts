export interface StockResult {
  stock: number;
  low: number;
  mid: number;
  high: number;
}

export interface SizeResult {
  code: string;
  name: string;
}

export interface ColorResult {
  name: string;
  hex: string;
}

export interface WarehouseResult {
  code: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface SizeVariantResult {
  id: string;
  size: SizeResult;
  stock: StockResult;
  reserved: number;
  availableStock: number;
  warehouses: WarehouseResult[];
}

export interface ColorVariantResult {
  id: string;
  color: ColorResult;
  sizeVariants: SizeVariantResult[];
}

export interface InventoryResult {
  id: string;
  productId: string;
  imageUrl: string;
  brand: string;
  slug: string;
  totalStock: number;
  totalReserved: number;
  totalAvailableStock: number;
  colorVariants: ColorVariantResult[];
}

export interface InventoryQueryParams {
  productId?: string;
  brand?: string;
  warehouseCode?: string;
  minStock?: number;
  maxStock?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface UpdateInventorySizeRequest {
  size: string;
  stock: number;
  low: number;
  mid: number;
  high: number;
  warehouses: string[];
}

export interface UpdateInventoryColorRequest {
  colorVariantId: string;
  sizeVariants: UpdateInventorySizeRequest[];
}

export interface UpdateInventoryRequest {
  id: string;
  colorVariants: UpdateInventoryColorRequest[];
}
