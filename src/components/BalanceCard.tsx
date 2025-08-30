import { TrendingUp, TrendingDown } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface BalanceCardProps {
  balance: number;
  upcomingPayments?: number;
  changePercentage?: number;
  className?: string;
}

export const BalanceCard = ({ 
  balance, 
  upcomingPayments = 0, 
  changePercentage = 0,
  className = "" 
}: BalanceCardProps) => {
  const isPositiveChange = changePercentage >= 0;

  return (
    <div className={`bg-gradient-balance rounded-2xl p-6 shadow-elegant ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Balance</h3>
          <div className="text-4xl font-bold text-foreground mt-1">
            {formatINR(balance)}
          </div>
        </div>
        
        {upcomingPayments > 0 && (
          <div className="text-sm text-muted-foreground">
            Upcoming payments: {formatINR(upcomingPayments)}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {isPositiveChange ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span className={`text-sm font-medium ${
            isPositiveChange ? 'text-success' : 'text-destructive'
          }`}>
            {Math.abs(changePercentage).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};