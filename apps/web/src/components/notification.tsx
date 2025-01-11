"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationTypes = {
  TRANSACTIONS: "transactions",
  TRANSACTION: "transaction",
  INBOX: "inbox",
  MATCH: "match",
};

interface NotificationItemProps {
  id: string;
  setOpen: (isOpen: boolean) => void;
  description: string;
  createdAt: string; 
  recordId?: string; 
  from?: string; 
  to?: string; 
  markMessageAsRead?: (id: string) => void; 
  type: keyof typeof NotificationTypes;
}

function EmptyState({ description }: { description: string }) {
  return (
    <div className="h-[460px] flex items-center justify-center flex-col space-y-4">
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
        <Icons.Inbox size={18} />
      </div>
      <p className="text-[#606060] text-sm">{description}</p>
    </div>
  );
}

const NotificationItem = ({
  id,
  setOpen,
  description,
  createdAt,
  recordId,
  from,
  to,
  markMessageAsRead,
  type,
}: NotificationItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(createdAt));

  const handleClick = () => {
    setOpen(false);
    const baseLink = `/${type === NotificationTypes.TRANSACTIONS ? "transactions" : type}`;
    const query = type === NotificationTypes.TRANSACTIONS ? `?filter=${JSON.stringify({ date: { from, to } })}` : `?id=${recordId}`;
    return `${baseLink}${query}`;
  };

  const iconMap = {
    [NotificationTypes.TRANSACTIONS]: <Icons.Transactions />,
    [NotificationTypes.TRANSACTION]: <Icons.Transactions />,
    [NotificationTypes.INBOX]: <Icons.Email />,
    [NotificationTypes.MATCH]: <Icons.Match />,
  };

  return (
    <div className="flex items-center justify-between space-x-4 px-3 py-3 hover:bg-secondary">
      <Link  href={"https://react-icons.github.io/react-icons/search/#q=webho"} onClick={handleClick} className="flex items-center space-x-4">
        <div className="h-9 w-9 flex items-center justify-center border rounded-full">
          {iconMap[type]}
        </div>
        <div>
          <p className="text-sm">{description}</p>
          <span className="text-xs text-[#606060]">{timeAgo} ago</span>
        </div>
      </Link>
      {markMessageAsRead && (
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
          onClick={() => markMessageAsRead(id)}
        >
          <Icons.Inventory2 />
        </Button>
      )}
    </div>
  );
};

export function NotificationCenter() {
  const [isOpen, setOpen] = useState(false);
  const {
    hasUnseenNotifications,
    notifications,
    markMessageAsRead,
    markAllMessagesAsSeen,
  } = useNotifications();

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const archivedNotifications = notifications.filter(notification => notification.read);

  useEffect(() => {
    if (isOpen && hasUnseenNotifications) {
      markAllMessagesAsSeen();
    }
  }, [hasUnseenNotifications, isOpen]);

  return (
    <Popover onOpenChange={setOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 flex items-center relative"
        >
          {hasUnseenNotifications && (
            <div className="w-1.5 h-1.5 bg-[#FFD02B] rounded-full absolute top-0 right-0" />
          )}
          <Icons.Notifications size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-[535px] w-screen md:w-[400px] p-0 overflow-hidden relative"
        align="end"
        sideOffset={10}
      >
        <Tabs defaultValue="inbox">
          <TabsList className="w-full justify-start bg-transparent border-b-[1px] rounded-none py-6">
            <TabsTrigger value="inbox" className="font-normal">Inbox</TabsTrigger>
            <TabsTrigger value="archive" className="font-normal">Archive</TabsTrigger>
          </TabsList>

          <Link href="/settings/notifications" className="absolute right-[11px] top-1.5">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-transparent hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Icons.Settings className="text-[#606060]" size={16} />
            </Button>
          </Link>

          <TabsContent value="inbox" className="relative mt-0">
            {!unreadNotifications.length ? (
              <EmptyState description="No new notifications" />
            ) : (
              <ScrollArea className="pb-12 h-[485px]">
                <div className="divide-y">
                  {unreadNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      markMessageAsRead={markMessageAsRead}
                      setOpen={setOpen}
                      description={notification.payload?.description || "No description available"}
                      createdAt={notification.createdAt}
                      recordId={notification.payload?.recordId}
                      type={notification.payload?.type}
                      from={notification.payload?.from}
                      to={notification.payload?.to}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            {!archivedNotifications.length ? (
              <EmptyState description="Nothing in the archive" />
            ) : (
              <ScrollArea className="h-[490px]">
                <div className="divide-y">
                  {archivedNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      markMessageAsRead={markMessageAsRead}
                      setOpen={setOpen}
                      description={notification.payload?.description || "No description available"}
                      createdAt={notification.createdAt}
                      recordId={notification.payload?.recordId}
                      type={notification.payload?.type}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
