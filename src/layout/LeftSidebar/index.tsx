import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VERTICAL_MENU_ITEMS } from './menu';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const LeftSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleItem = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.url;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);

    return (
      <div key={item.key} className="space-y-1">
        {item.isTitle ? (
          <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            {item.label}
          </div>
        ) : (
          <div>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                isActive && 'bg-accent text-accent-foreground'
              )}
              onClick={() => hasChildren && toggleItem(item.key)}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )}
                />
              )}
            </Button>
            {hasChildren && isExpanded && (
              <div className="ml-4 space-y-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.key}
                    to={child.url}
                    className={cn(
                      'block px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground',
                      location.pathname === child.url &&
                        'bg-accent text-accent-foreground'
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Track Finance</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {VERTICAL_MENU_ITEMS.map((item) => renderMenuItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeftSidebar;