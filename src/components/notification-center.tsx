"use client";

import { format } from "date-fns";
import type { Notification } from "./dashboard";
import { Bell, AlertTriangle, AlertCircle, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationCenterProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationClass = (type: string, read: boolean) => {
    let baseClass = "p-4 border rounded-lg mb-3 ";

    if (!read) {
      baseClass += "bg-muted/30 ";
    }

    switch (type) {
      case "critical":
        return baseClass + (!read ? "border-l-4 border-l-destructive" : "");
      case "warning":
        return baseClass + (!read ? "border-l-4 border-l-amber-500" : "");
      default:
        return baseClass + (!read ? "border-l-4 border-l-primary" : "");
    }
  };

  return (
    <div className="space-y-2">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={getNotificationClass(
              notification.type,
              notification.read
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.date), "MMM d, h:mm a")}
                  </span>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
