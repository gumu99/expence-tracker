import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Transaction, AppState, MonthlyGoal, Reward, DailyExpense } from '@/types';
import { loadUser, saveUser, loadTransactions, saveTransactions, clearAllData } from '@/utils/storage';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  monthlyGoals: MonthlyGoal[];
  rewards: Reward[];
  dailyExpenses: DailyExpense[];
  setUser: (user: User) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateMonthlyGoal: (goalId: string, targetAmount: number) => void;
  addMonthlyGoal: (goal: Omit<MonthlyGoal, 'id'>) => void;
  unlockReward: (rewardId: string) => void;
  logout: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default rewards
const DEFAULT_REWARDS: Reward[] = [
  {
    id: 'reward_1',
    title: 'Budget Master',
    description: 'Stay under budget for 3 consecutive months',
    pointsRequired: 100,
    isUnlocked: false
  },
  {
    id: 'reward_2',
    title: 'Savings Champion',
    description: 'Save more than 30% of your income',
    pointsRequired: 200,
    isUnlocked: false
  },
  {
    id: 'reward_3',
    title: 'Expense Tracker',
    description: 'Log expenses for 30 consecutive days',
    pointsRequired: 150,
    isUnlocked: false
  },
  {
    id: 'reward_4',
    title: 'Smart Spender',
    description: 'Stay under budget in all categories',
    pointsRequired: 300,
    isUnlocked: false
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [monthlyGoals, setMonthlyGoalsState] = useState<MonthlyGoal[]>([]);
  const [rewards, setRewardsState] = useState<Reward[]>(DEFAULT_REWARDS);
  const [dailyExpenses, setDailyExpensesState] = useState<DailyExpense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedUser = loadUser();
    const loadedTransactions = loadTransactions();
    
    setUserState(loadedUser);
    setTransactionsState(loadedTransactions);
    
    // Initialize monthly goals if user exists
    if (loadedUser) {
      initializeMonthlyGoals(loadedUser);
    }
    
    // Calculate daily expenses from transactions
    const calculatedDailyExpenses = calculateDailyExpenses(loadedTransactions);
    setDailyExpensesState(calculatedDailyExpenses);
    
    setIsLoaded(true);
  }, []);

  // Initialize monthly goals for the current year
  const initializeMonthlyGoals = (user: User) => {
    const currentYear = new Date().getFullYear();
    const goals: MonthlyGoal[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStr = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      const existingGoal = monthlyGoals.find(g => g.month === monthStr);
      
      if (!existingGoal) {
        goals.push({
          id: `goal_${monthStr}`,
          month: monthStr,
          targetAmount: user.monthlyExpenseGoal || 50000,
          currentAmount: 0,
          isAchieved: false,
          rewardPoints: 0
        });
      }
    }
    
    if (goals.length > 0) {
      setMonthlyGoalsState(prev => [...prev, ...goals]);
    }
  };

  // Calculate daily expenses from transactions
  const calculateDailyExpenses = (transactions: Transaction[]): DailyExpense[] => {
    const dailyMap = new Map<string, DailyExpense>();
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only expenses
        const date = transaction.date.split('T')[0];
        const existing = dailyMap.get(date);
        
        if (existing) {
          existing.totalAmount += Math.abs(transaction.amount);
          existing.transactions.push(transaction);
        } else {
          dailyMap.set(date, {
            date,
            totalAmount: Math.abs(transaction.amount),
            transactions: [transaction],
            isUnderBudget: true // Will be calculated based on monthly goal
          });
        }
      }
    });
    
    return Array.from(dailyMap.values());
  };

  // Update daily expenses when transactions change
  useEffect(() => {
    const calculatedDailyExpenses = calculateDailyExpenses(transactions);
    setDailyExpensesState(calculatedDailyExpenses);
  }, [transactions]);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    saveUser(newUser);
    initializeMonthlyGoals(newUser);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactionsState(updatedTransactions);
    saveTransactions(updatedTransactions);
    
    // Update monthly goals
    updateMonthlyGoalsFromTransaction(newTransaction);
  };

  const updateMonthlyGoalsFromTransaction = (transaction: Transaction) => {
    if (transaction.amount < 0) { // Expense
      const month = transaction.date.substring(0, 7); // YYYY-MM format
      setMonthlyGoalsState(prev => 
        prev.map(goal => 
          goal.month === month 
            ? { ...goal, currentAmount: goal.currentAmount + Math.abs(transaction.amount) }
            : goal
        )
      );
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactionsState(updatedTransactions);
    saveTransactions(updatedTransactions);
    
    // Update monthly goals if deleting an expense
    if (transaction && transaction.amount < 0) {
      const month = transaction.date.substring(0, 7);
      setMonthlyGoalsState(prev => 
        prev.map(goal => 
          goal.month === month 
            ? { ...goal, currentAmount: goal.currentAmount - Math.abs(transaction.amount) }
            : goal
        )
      );
    }
  };

  const updateMonthlyGoal = (goalId: string, targetAmount: number) => {
    setMonthlyGoalsState(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, targetAmount }
          : goal
      )
    );
  };

  const addMonthlyGoal = (goal: Omit<MonthlyGoal, 'id'>) => {
    const newGoal: MonthlyGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setMonthlyGoalsState(prev => [...prev, newGoal]);
  };

  const unlockReward = (rewardId: string) => {
    setRewardsState(prev => 
      prev.map(reward => 
        reward.id === rewardId 
          ? { ...reward, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : reward
      )
    );
  };

  const logout = () => {
    clearAllData();
    setUserState(null);
    setTransactionsState([]);
    setMonthlyGoalsState([]);
    setRewardsState(DEFAULT_REWARDS);
    setDailyExpensesState([]);
  };

  return (
    <AppContext.Provider 
      value={{
        user,
        transactions,
        monthlyGoals,
        rewards,
        dailyExpenses,
        setUser,
        addTransaction,
        deleteTransaction,
        updateMonthlyGoal,
        addMonthlyGoal,
        unlockReward,
        logout,
        isLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}