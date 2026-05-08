import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Truck, 
  User,
  LogOut,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Listagem Geral', to: '/listagem', icon: ListChecks },
  { label: 'Minhas Compras', to: '/customer/1/orders', icon: ShoppingBag },
  { label: 'Entregas (Motorista)', to: '/employee/1/orders', icon: Truck },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Truck className="text-white h-5 w-5" />
        </div>
        <span className="font-bold text-xl tracking-tight">Logistics<span className="text-primary">Manager</span></span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Navegação
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Keven Rodrigues</span>
            <span className="text-xs text-muted-foreground">Premium User</span>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
