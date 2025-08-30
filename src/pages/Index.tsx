import { useState, useMemo } from "react";
import { VirtualCard } from "@/components/VirtualCard";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { SavingsOverview } from "@/components/SavingsOverview";
import { EnhancedExpenseChart } from "@/components/EnhancedExpenseChart";
import { MonthlyGoalCard } from "@/components/MonthlyGoalCard";
import { RewardsSystem } from "@/components/RewardsSystem";
import { DailyExpenseTracker } from "@/components/DailyExpenseTracker";
import { ExpenseRecommendations } from "@/components/ExpenseRecommendations";
import { Navigation } from "@/components/Navigation";
import { SetupDialog } from "@/components/setup/SetupDialog";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { ExportCSVButton } from "@/components/actions/ExportCSVButton";
import { ProfileScreen } from "@/components/ProfileScreen";
import { AlertsScreen } from "@/components/AlertsScreen";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const { 
    user, 
    transactions, 
    monthlyGoals, 
    rewards, 
    dailyExpenses,
    isLoaded, 
    deleteTransaction,
    updateMonthlyGoal 
  } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Calculate balance from user's initial balance + transaction amounts
  const balance = useMemo(() => {
    if (!user) return 0;
    return user.initialBalance + transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [user, transactions]);

  // Get recent transactions (last 3, sorted by date desc)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [transactions]);

  // Calculate savings this month
  const { savedThisMonth, lastMonthSavings } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
    });

    const currentIncome = currentMonthTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const currentExpenses = Math.abs(currentMonthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    
    const lastIncome = lastMonthTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const lastExpenses = Math.abs(lastMonthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

    return {
      savedThisMonth: currentIncome - currentExpenses,
      lastMonthSavings: (currentIncome - currentExpenses) - (lastIncome - lastExpenses)
    };
  }, [transactions]);

  // Generate chart data for last 6 months
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const now = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = months[date.getMonth()];
      const fullMonth = fullMonths[date.getMonth()];
      
      const monthExpenses = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === date.getMonth() && 
                 tDate.getFullYear() === date.getFullYear() && 
                 t.amount < 0;
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      data.push({ month, amount: monthExpenses, fullMonth });
    }
    
    return data;
  }, [transactions]);

  // Generate category data for pie chart
  const categoryData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && 
             tDate.getFullYear() === currentYear && 
             t.amount < 0;
    });

    const categoryTotals = new Map<string, number>();
    currentMonthExpenses.forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + Math.abs(t.amount));
    });

    const total = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);
    
    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: '#8884d8'
    }));
  }, [transactions]);

  // Get current month goal
  const currentMonthGoal = useMemo(() => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return monthlyGoals.find(g => g.month === monthStr) || null;
  }, [monthlyGoals]);

  // Get expenses for history screen
  const expenses = useMemo(() => {
    return transactions
      .filter(t => t.amount < 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  // Show setup dialog if no user and data is loaded
  if (isLoaded && !user) {
    return <SetupDialog open={true} />;
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const renderHomeScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hi {user?.name}</h1>
          <p className="text-muted-foreground">Welcome Back</p>
        </div>
        <Avatar className="h-10 w-10 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Virtual Card */}
      <VirtualCard 
        cardNumber="3782822463100005"
        holderName={user?.name || 'User'}
      />

      {/* Balance and Quick Stats */}
      <div className="grid grid-cols-1 gap-4">
        <BalanceCard 
          balance={balance}
          upcomingPayments={0}
          changePercentage={0}
        />
      </div>

      {/* Monthly Goal Card */}
      {currentMonthGoal && (
        <MonthlyGoalCard 
          goal={currentMonthGoal}
          onUpdateGoal={updateMonthlyGoal}
        />
      )}

      {/* Daily Expense Tracker */}
      <DailyExpenseTracker 
        dailyExpenses={dailyExpenses}
        monthlyGoal={currentMonthGoal?.targetAmount || 50000}
      />

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <div className="space-y-2">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onDelete={() => deleteTransaction(transaction.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first transaction using the + button below.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHistoryScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground">Track your spending patterns</p>
      </div>

      {/* Savings Overview */}
      <SavingsOverview 
        savedThisMonth={savedThisMonth}
        lastMonthComparison={lastMonthSavings}
      />

      {/* Enhanced Expense Chart */}
      <EnhancedExpenseChart 
        data={chartData}
        categoryData={categoryData}
        highlightedMonth="Aug"
      />

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportCSVButton />
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
        <div className="space-y-2">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TransactionItem 
                key={expense.id} 
                transaction={expense} 
                onDelete={() => deleteTransaction(expense.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGoalsScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Goals & Rewards</h1>
        <p className="text-muted-foreground">Set targets and earn rewards</p>
      </div>

      {/* Monthly Goals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Monthly Goals</h2>
        <div className="space-y-4">
          {monthlyGoals.slice(0, 3).map((goal) => (
            <MonthlyGoalCard 
              key={goal.id}
              goal={goal}
              onUpdateGoal={updateMonthlyGoal}
            />
          ))}
        </div>
      </div>

      {/* Rewards System */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Rewards</h2>
        <RewardsSystem 
          rewards={rewards}
          userPoints={user?.rewardPoints || 0}
        />
      </div>
    </div>
  );

  const renderAnalyticsScreen = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Analytics</h1>
        <p className="text-muted-foreground">AI-powered insights and recommendations</p>
      </div>

      {/* Expense Recommendations */}
      <ExpenseRecommendations 
        transactions={transactions}
        monthlyGoal={currentMonthGoal?.targetAmount || 50000}
      />

      {/* Enhanced Expense Chart */}
      <EnhancedExpenseChart 
        data={chartData}
        categoryData={categoryData}
        highlightedMonth="Aug"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'home' && renderHomeScreen()}
        {activeTab === 'history' && renderHistoryScreen()}
        {activeTab === 'goals' && renderGoalsScreen()}
        {activeTab === 'analytics' && renderAnalyticsScreen()}
        {activeTab === 'notifications' && <AlertsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTransaction={() => setShowAddTransaction(true)}
      />

      <AddTransactionDialog 
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />
    </div>
  );
};

export default Index;
