import { Home, BarChart3, Plus, Bell, User, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAddTransaction?: () => void;
  className?: string;
}

export const Navigation = ({ 
  activeTab = 'home', 
  onTabChange,
  onAddTransaction,
  className = "" 
}: NavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: BarChart3, label: 'History' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border ${className}`}>
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div key={item.id} className="flex-1 flex justify-center">
                {index === 3 && (
                  <Button
                    onClick={onAddTransaction}
                    size="lg"
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full bg-gradient-card shadow-glow hover:shadow-glow/80 transition-all"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                )}
                
                <button
                  onClick={() => onTabChange?.(item.id)}
                  className={`flex flex-col items-center gap-1 p-3 transition-colors ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};