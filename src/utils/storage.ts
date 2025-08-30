import { User, Transaction } from '@/types';

const STORAGE_KEYS = {
  USER: 'expense-tracker.user',
  TRANSACTIONS: 'expense-tracker.transactions',
} as const;

function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function loadUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return safeParseJSON(stored, null);
}

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function loadTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return safeParseJSON(stored, []);
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
}