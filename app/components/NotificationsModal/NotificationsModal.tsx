"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import ModalComponent from "@/app/components/Modal/Modal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import { Notification } from "@/app/hooks/useNotifications";
import { formatDate } from "@/app/utils/dateFormatter";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  title: string;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  title,
  hasMore,
  isLoading,
  onLoadMore,
}: NotificationsModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(async () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom && hasMore && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const unreadsCount = notifications.filter(
    (notification) => !notification.readed,
  ).length;

  return (
    <ModalComponent isOpen={isOpen} size="3xl" onClose={onClose}>
      <>
        <ModalHeader className="flex flex-col gap-1 text-gray-600 w-full text-center">
          {title}
          {unreadsCount > 0 && (
            <span className="text-sm text-red-600">({unreadsCount} não lidas)</span>
          )}
        </ModalHeader>
        <ModalBody className="text-gray-500 min-h-[60vh] max-h-[80vh] overflow-hidden p-0">
          <div ref={scrollContainerRef} className="h-full overflow-y-auto flex flex-col">
            {notifications.length === 0 ? (
              <div className="flex items-center justify-center flex-1 text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              <>
                <div className="space-y-2 p-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 transition-all ${
                        notification.readed
                          ? "bg-white border-gray-300"
                          : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {notification.description}
                          </p>
                          {notification.productName && (
                            <p className="text-xs text-gray-600 mt-1">
                              Produto: {notification.productName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.readed && (
                          <div className="ml-3 flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="p-4 text-center border-t border-gray-200">
                    {isLoadingMore ? (
                      <p className="text-sm text-gray-600">Carregando mais...</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Role para carregar mais notificações
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </ModalBody>
      </>
    </ModalComponent>
  );
}
