import { Bell, Search, Sun, Moon, PanelLeft, User, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';
import { useSidebar } from '@/layout/LeftSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TopNavbar = () => {
    const { theme, setTheme } = useTheme();
    const { isOpen, setIsOpen } = useSidebar();
    const { removeSession } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        removeSession();
        toast.success('Logout efetuado com sucesso', {
            position: 'top-right',
            duration: 3000,
        });
        navigate('/auth/login');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full h-14 items-center px-4">
                <div className="flex items-center">
                    {/* Botão para abrir a sidebar em telas móveis */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-9 w-9 mr-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <PanelLeft className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                    </Button>
                    <span className="text-base sr-only">Track Finance</span>
                </div>

                {/* Centro: Pesquisa */}
                <div className="flex-1 flex items-center pr-4 pl-0">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Pesquisar..."
                            className="w-full bg-background/50 pl-8 focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* Direita: Ícones */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Alternar tema</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notificações</span>
                    </Button>
                    
                    {/* Dropdown do perfil do usuário */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden">
                                <Avatar>
                                    <AvatarImage src="/avatar-placeholder.png" alt="Perfil" />
                                    <AvatarFallback>VS</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Perfil do usuário</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;