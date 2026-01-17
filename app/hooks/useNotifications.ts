import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { apiFetch } from "@/app/shared/requests";

export interface Notification {
  id: string;
  companyId: string;
  entity: "PRODUCTS" | "SALES";
  description: string;
  productName?: string;
  readed: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  data: Notification[];
  totalCount: number;
}

interface UseNotificationsReturn {
  notificationsProduct: Notification[];
  notificationsSales: Notification[];
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const TAKE = 50;

async function fetchNotifications({ pageParam = 0 }) {
  const response = await apiFetch<NotificationsResponse>(
    `/notifications?skip=${pageParam}&take=${TAKE}`,
    "GET",
  );
  return {
    data: Array.isArray(response.data) ? response.data : [],
    totalCount: response.totalCount || 0,
    nextOffset: pageParam + TAKE,
  };
}

export function useNotifications(): UseNotificationsReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalFetched < lastPage.totalCount ? lastPage.nextOffset : undefined;
    },
  });

  const allNotifications = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const notificationsProduct = allNotifications.filter(
    (notification) => notification.entity === "PRODUCTS",
  );
  const notificationsSales = allNotifications.filter(
    (notification) => notification.entity === "SALES",
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const loadMore = useCallback(async () => {
    await fetchNextPage();
  }, [fetchNextPage]);

  return {
    notificationsProduct,
    notificationsSales,
    totalCount,
    isLoading,
    error: error as Error | null,
    hasMore: hasNextPage ?? false,
    loadMore,
    refetch,
    refreshNotifications: refetch,
  };
}
