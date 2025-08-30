import { User, Settings, LogOut, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { AboutUs } from "@/components/AboutUs";

export const ProfileScreen = () => {
  const { user, transactions, logout } = useApp();
  const [showAboutUs, setShowAboutUs] = useState(false);

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const handleLogout = () => {
    logout();
  };

  if (showAboutUs) {
    return <AboutUs onBack={() => setShowAboutUs(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* User Info Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Stats Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Account Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Initial Balance</p>
            <p className="text-lg font-semibold text-foreground">{formatINR(user?.initialBalance || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Salary</p>
            <p className="text-lg font-semibold text-foreground">{formatINR(user?.salary || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-lg font-semibold text-foreground">{totalTransactions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-semibold text-success">{formatINR(totalIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-semibold text-destructive">{formatINR(totalExpenses)}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => setShowAboutUs(true)}
        >
          <Info className="h-4 w-4 mr-2" />
          About Us
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};