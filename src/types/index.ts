export interface User {
  name: string;
  salary: number;
  initialBalance: number;
  createdAt: string;
  monthlyExpenseGoal?: number;
  rewardPoints?: number;
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number; // Positive for income, negative for expense
  description?: string;
  type: 'income' | 'expense';
}

export interface MonthlyGoal {
  id: string;
  month: string; // Format: "YYYY-MM"
  targetAmount: number;
  currentAmount: number;
  isAchieved: boolean;
  rewardPoints: number;
}

export interface DailyExpense {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  isUnderBudget: boolean;
}

export interface ExpenseRecommendation {
  category: string;
  recommendedAmount: number;
  currentAmount: number;
  percentage: number;
  status: 'under' | 'over' | 'optimal';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AppState {
  user: User | null;
  transactions: Transaction[];
  monthlyGoals: MonthlyGoal[];
  rewards: Reward[];
}

export const TRANSACTION_CATEGORIES = [
  'Food',
  'Taxi', 
  'Netflix',
  'Salary',
  'Paypal',
  'Shopping',
  'Other'
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];