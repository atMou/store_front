import { useAppSelector } from "@/store/hooks";
import { useGetAllOrdersQuery } from "../api";
import { selectAllOrders } from "../slice";
import { GetAllOrdersRequest } from "../types";

interface UseOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export const useOrders = ({
  pageNumber = 1,
  pageSize = 10,
  status,
  minPrice,
  maxPrice,
  startDate,
  endDate,
  searchTerm,
}: UseOrdersParams = {}) => {
  const allOrders = useAppSelector(selectAllOrders);
  
  const queryParams: GetAllOrdersRequest = {
    pageNumber,
    pageSize,
    ...(status && { status }),
    ...(minPrice && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(searchTerm && { searchTerm }),
  };

  const { data, isLoading, isFetching, error, refetch } =
    useGetAllOrdersQuery(queryParams);

  return {
    orders: allOrders,
    pagination: {
      currentPage: data?.currentPage || 1,
      pageSize: data?.pageSize || 10,
      totalCount: data?.totalCount || 0,
      totalPages: data?.totalPages || 0,
      hasNextPage: data?.hasNextPage || false,
      hasPreviousPage: data?.hasPreviousPage || false,
    },
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
