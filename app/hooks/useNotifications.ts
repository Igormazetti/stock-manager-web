import { useEffect, useState, useCallback } from "react";
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

export function useNotifications(): UseNotificationsReturn {
  const [notificationsProduct, setNotificationsProduct] = useState<Notification[]>([]);
  const [notificationsSales, setNotificationsSales] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [skip, setSkip] = useState(0);
  const TAKE = 50;

  const fetchNotifications = useCallback(async (offset: number = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch<{ data: Notification[]; totalCount: number }>(
        `/notifications?skip=${offset}&take=${TAKE}`,
        "GET",
      );

      const allNotifications = Array.isArray(response.data) ? response.data : [];
      const productNotifications = allNotifications.filter(
        (notification) => notification.entity === "PRODUCTS",
      );
      const salesNotifications = allNotifications.filter(
        (notification) => notification.entity === "SALES",
      );

      if (offset === 0) {
        setNotificationsProduct(productNotifications);
        setNotificationsSales(salesNotifications);
      } else {
        setNotificationsProduct((previousNotifications) => [
          ...previousNotifications,
          ...productNotifications,
        ]);
        setNotificationsSales((previousNotifications) => [
          ...previousNotifications,
          ...salesNotifications,
        ]);
      }

      setTotalCount(response.totalCount || 0);
      setSkip(offset + TAKE);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    await fetchNotifications(skip);
  }, [skip, fetchNotifications]);

  const refetch = useCallback(async () => {
    setSkip(0);
    await fetchNotifications(0);
  }, [fetchNotifications]);

  const refreshNotifications = useCallback(async () => {
    setSkip(0);
    await fetchNotifications(0);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = notificationsProduct.length + notificationsSales.length < totalCount;

  return {
    notificationsProduct,
    notificationsSales,
    totalCount,
    isLoading,
    error,
    hasMore,
    loadMore,
    refetch,
    refreshNotifications,
  };
}
