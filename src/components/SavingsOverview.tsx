import { TrendingUp } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface SavingsOverviewProps {
  savedThisMonth: number;
  lastMonthComparison?: number;
  className?: string;
}

export const SavingsOverview = ({ 
  savedThisMonth, 
  lastMonthComparison = 0,
  className = "" 
}: SavingsOverviewProps) => {
  const isPositiveGrowth = lastMonthComparison > 0;

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium">
            Saved This Month
          </h3>
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
        
        <div className="text-3xl font-bold text-success">
          {formatINR(savedThisMonth)}
        </div>
        
        {lastMonthComparison !== 0 && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isPositiveGrowth ? 'text-success' : 'text-destructive'
            }`}>
              {isPositiveGrowth ? '+' : ''}{formatINR(lastMonthComparison)}
            </span>
            <span className="text-muted-foreground text-sm">
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};