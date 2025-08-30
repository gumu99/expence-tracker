import { useState, useMemo } from "react";
import { Bell, AlertTriangle, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/utils/currency";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  icon: React.ReactNode;
  timestamp: Date;
}

export const AlertsScreen = () => {
  const { user, transactions } = useApp();

  const alerts = useMemo(() => {
    const alertList: Alert[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const currentExpenses = Math.abs(
      currentMonthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const currentIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = (user?.initialBalance || 0) + transactions.reduce((sum, t) => sum + t.amount, 0);

    // Alert 1: High spending this month
    if (currentExpenses > (user?.salary || 0) * 0.8) {
      alertList.push({
        id: 'high-spending',
        type: 'warning',
        title: 'High Spending Alert',
        message: `You've spent ${formatINR(currentExpenses)} this month, which is ${Math.round((currentExpenses / (user?.salary || 1)) * 100)}% of your monthly salary.`,
        icon: <TrendingDown className="h-5 w-5" />,
        timestamp: now
      });
    }

    // Alert 2: Low balance warning
    if (currentBalance < (user?.salary || 0) * 0.2) {
      alertList.push({
        id: 'low-balance',
        type: 'danger',
        title: 'Low Balance Warning',
        message: `Your current balance is ${formatINR(currentBalance)}. Consider reviewing your expenses.`,
        icon: <AlertTriangle className="h-5 w-5" />,
        timestamp: now
      });
    }

    // Alert 3: No income this month
    if (currentIncome === 0 && currentMonthTransactions.length > 0) {
      alertList.push({
        id: 'no-income',
        type: 'info',
        title: 'No Income Recorded',
        message: 'You haven\'t recorded any income this month. Don\'t forget to add your salary or other income sources.',
        icon: <DollarSign className="h-5 w-5" />,
        timestamp: now
      });
    }

    // Alert 4: Recent activity
    const recentTransactions = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const daysDiff = Math.floor((now.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      });

    if (recentTransactions.length >= 5) {
      alertList.push({
        id: 'active-spending',
        type: 'info',
        title: 'Active Week',
        message: `You've made ${recentTransactions.length} transactions in the last 7 days. Keep track of your spending patterns.`,
        icon: <Activity className="h-5 w-5" />,
        timestamp: now
      });
    }

    // Alert 5: Savings opportunity
    const monthlySavings = currentIncome - currentExpenses;
    if (monthlySavings > 0 && monthlySavings < (user?.salary || 0) * 0.1) {
      alertList.push({
        id: 'savings-opportunity',
        type: 'info',
        title: 'Savings Opportunity',
        message: `You're saving ${formatINR(monthlySavings)} this month. Consider increasing your savings rate for better financial health.`,
        icon: <DollarSign className="h-5 w-5" />,
        timestamp: now
      });
    }

    return alertList.sort((a, b) => {
      const typeOrder = { danger: 0, warning: 1, info: 2 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }, [user, transactions]);

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'danger': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Stay on top of your finances</p>
        </div>
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  alert.type === 'danger' ? 'bg-destructive/10 text-destructive' :
                  alert.type === 'warning' ? 'bg-secondary/10 text-secondary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {alert.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <Badge variant={getAlertColor(alert.type)}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
            <p className="text-muted-foreground">
              No alerts at the moment. Keep up the good financial habits!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};