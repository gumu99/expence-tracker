import { formatINRCompact } from "@/utils/currency";

interface ChartData {
  month: string;
  amount: number;
  fullMonth: string;
}

interface ExpenseChartProps {
  data: ChartData[];
  highlightedMonth?: string;
  className?: string;
}

export const ExpenseChart = ({ 
  data, 
  highlightedMonth,
  className = "" 
}: ExpenseChartProps) => {
  const highlightedData = highlightedMonth 
    ? data.find(item => item.month === highlightedMonth)
    : null;

  const maxAmount = Math.max(...data.map(d => d.amount));
  const minAmount = Math.min(...data.map(d => d.amount));

  return (
    <div className={`bg-card rounded-2xl p-6 border border-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-semibold">Expense History</h3>
          {highlightedData && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
              <span className="text-primary text-sm font-medium">
                {highlightedData.fullMonth} {formatINRCompact(highlightedData.amount)}
              </span>
            </div>
          )}
        </div>
        
        <div className="relative h-64 bg-muted/20 rounded-lg p-4">
          {/* Simple Chart Visualization */}
          <div className="flex items-end justify-between h-full gap-2">
            {data.map((item, index) => {
              const height = ((item.amount - minAmount) / (maxAmount - minAmount)) * 100;
              const isHighlighted = item.month === highlightedMonth;
              
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative flex-1 flex items-end">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isHighlighted 
                          ? 'bg-primary shadow-glow' 
                          : 'bg-primary/60 hover:bg-primary/80'
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    {isHighlighted && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatINRCompact(item.amount)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};