import { AppRoutes } from "@/constants";

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export type ApiErrorResponse = {
  status: number;
  data: {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    Errors?: string[];
  };
};

export interface PaginatedResult<T = unknown> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface Address {
  id: string;
  receiverName: string;
  street: string;
  city: string;
  postalCode: number;
  houseNumber: number;
  extraDetails?: string | null;
  isMain?: boolean;
}
