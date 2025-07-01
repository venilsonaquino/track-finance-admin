import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VERTICAL_MENU_ITEMS, MenuItemType } from './menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';

// Contexto para controlar o estado da Sidebar em dispositivos móveis
import { createContext, useContext } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Componente de menu que é compartilhado entre a versão desktop e mobile
const SidebarMenu = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleItem = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItemType, level: number = 0) => {
    const isActive = location.pathname === item.url;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const indent = level * 16; // 16px de indentação por nível

    return (
      <div key={item.key} className="space-y-1">
        {item.isTitle ? (
          <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            {item.label}
          </div>
        ) : (
          <div>
            {item.url ? (
              <Link to={item.url} className="w-full cursor-pointer">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full flex items-center gap-2 px-4 justify-start cursor-pointer',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                  style={{ paddingLeft: `${indent + 16}px` }}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn(item.badge.variant, 'rounded-sm')}>
                      {item.badge.text}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  )}
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  'w-full flex items-center gap-2 px-4 justify-start cursor-pointer',
                  isActive && 'bg-accent text-accent-foreground'
                )}
                style={{ paddingLeft: `${indent + 16}px` }}
                onClick={() => hasChildren && toggleItem(item.key)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={cn(item.badge.variant, 'rounded-sm')}>
                    {item.badge.text}
                  </span>
                )}
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                )}
              </Button>
            )}
            {hasChildren && isExpanded && item.children && (
              <div className="space-y-1">
                {item.children.map((child) => renderMenuItem(child, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Track Finance</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {VERTICAL_MENU_ITEMS.map((item) => renderMenuItem(item))}
        </div>
      </ScrollArea>
    </>
  );
};

// Componente principal da Sidebar
const LeftSidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {/* Versão desktop: sempre visível em telas médias e acima */}
      <div className="hidden md:flex flex-col w-64 h-screen border-r bg-background">
        <SidebarMenu />
      </div>

      {/* Versão mobile: drawer que abre do lado esquerdo */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="left" 
          className="p-0 w-64" 
          title="Menu de navegação Track Finance"
        >
          <SidebarMenu />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LeftSidebar;