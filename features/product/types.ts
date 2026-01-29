import { PaginatedResult } from "@/types";

export interface FilterValues {
  category?: string;
  brand?: string;
  type?: string;
  subType?: string;
  sub?: string;
  color?: string;
  size?: string;
  material?: string;
  savings?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  orderBy?: string;
  sortDir?: string;
  pageNumber?: number;
  pageSize?: number;
  include?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  price: number;
  category: string;
  subCategory: string;
  description: string;
  newPrice?: number;
  discount?: number;
  rating: Rating;
  totalReviews: number;
  totalSales: number;
  productType: ProductType;
  status: Status;
  colors: Color[];
  sizes: Size[];
  colorVariants: ColorVariant[];
  images: Image[];
  alternatives: Product[];
  reviews: Review[];
  detailsAttributes: Attribute[];
  sizeFitAttributes: Attribute[];
  materialDetails: MaterialDetail[];
}
export interface Rating {
  value: number;
  description: string;
}

export interface ProductType {
  type: string;
  subType: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface Size {
  code: string;
  name: string;
}

export interface Status {
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
}

export interface ColorVariant {
  id: string;
  sku: string | null;
  color: Color;
  images: Image[];
  sizeVariants: SizeVariant[];
}

export interface SizeVariant {
  id: string;
  size: Size;
  stock: number;
  stockLevel: string;
  sku: string;
}
export interface Attribute {
  name: string;
  description: string;
}

export interface MaterialDetail {
  id: string;
  detail: string;
  percentage: number;
  material: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string;
  isMain: boolean;
}

export interface Review {
  id: string;
  comment: string;
  rating: number;
  ratingDescription: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  createdAt: string;
  productId: string;
}

export type { PaginatedResult } from "@/types";

export type ProductPaginatedResult = PaginatedResult<Product>;
