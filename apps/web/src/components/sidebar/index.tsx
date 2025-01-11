"use client";

import {
  useEffect,
  useState,
} from 'react';

import { Reorder } from 'framer-motion';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const icons = {
  "/overview": () => <Icons.Overview size={35} />,
  "/power": () => <Icons.AI size={35} />,
  "/inbox": () => <Icons.Inbox2 size={35} />,
  "/webhooks": () => <Icons.Webhooks size={35} />,
  "/settings/profile": () => <Icons.Settings size={35} />,
};

const defaultItems = [
  { path: "/overview", name: "Overview" },
  { path: "/power", name: "Power" },
  { path: "/inbox", name: "Inbox" },
  { path: "/webhooks", name: "Webhooks" },
  { path: "/settings/profile", name: "Settings" },
];

export function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const [items, setItems] = useState(defaultItems);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [loadingAttempts, setLoadingAttempts] = useState(0); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (currentPath) {
      if (loadingAttempts < 5) {
        timeoutId = setTimeout(() => {
          setLoadingAttempts((prev) => prev + 1);
          setIsLoading(false); 
        }, 5000 * loadingAttempts); 
      }
    }

    if (currentPath && pathname === currentPath) {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, currentPath, loadingAttempts]);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setCurrentPath(path);
    setLoadingAttempts(0); 
    router.push(path);
  };

  const handleRemove = (path: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.path !== path));
  };

  const handleDragEnd = (newItems: typeof defaultItems) => {
    setItems(newItems);
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="h-screen w-16 flex flex-col gap-15 py-20"
    >
      <nav className="flex flex-col items-center">
        <Reorder.Group
          axis="y"
          onReorder={handleDragEnd}
          values={items}
          className="flex flex-col items-center"
        >
          {items.map((item, index) => {
            const Icon = icons[item.path];

            return (
              <TooltipProvider key={index} delayDuration={70}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <Reorder.Item
                        value={item}
                        id={item.path}
                        className={cn(
                          "relative border border-transparent md:w-[45px] h-[45px] flex items-center md:justify-center mb-10",
                          isCustomizing
                            ? "bg-background border-[#DCDAD2] dark:border-[#2C2C2C]"
                            : ""
                        )}
                      >
                        <div
                          onClick={() => handleNavigation(item.path)}
                          className="flex items-center justify-center w-full cursor-pointer"
                        >
                          <Icon />
                        </div>
                      </Reorder.Item>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="px-3 py-1.5 text-xs hidden md:flex"
                    sideOffset={10}
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </Reorder.Group>
      </nav>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </div>
  );
}
