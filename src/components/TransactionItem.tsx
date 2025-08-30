import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coffee, 
  Car, 
  Monitor, 
  CreditCard,
  Wallet,
  ShoppingBag,
  Trash2
} from "lucide-react";
import { formatINR } from "@/utils/currency";
import { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: () => void;
  className?: string;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Food': Coffee,
    'Taxi': Car,
    'Netflix': Monitor,
    'Salary': Wallet,
    'Paypal': CreditCard,
    'Shopping': ShoppingBag,
  };
  
  const IconComponent = iconMap[category] || Wallet;
  return <IconComponent className="h-5 w-5" />;
};

export const TransactionItem = ({ transaction, onDelete, className = "" }: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-success/20' : 'bg-muted'}`}>
          {getCategoryIcon(transaction.category)}
        </div>
        
        <div>
          <div className="font-medium text-foreground">
            {transaction.category}
          </div>
          <div className="text-sm text-muted-foreground">
            {transaction.description || 'No description'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`font-semibold ${
          isIncome ? 'text-success' : 'text-foreground'
        }`}>
          {isIncome ? '+' : ''}{formatINR(Math.abs(transaction.amount))}
        </div>
        {isIncome ? (
          <ArrowUpRight className="h-4 w-4 text-success" />
        ) : (
          <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1 hover:bg-destructive/20 rounded transition-colors"
            title="Delete transaction"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        )}
      </div>
    </div>
  );
};