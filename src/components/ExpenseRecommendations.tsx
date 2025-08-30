import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { ExpenseRecommendation, Transaction, EXPENSE_CATEGORIES } from "@/types";

interface ExpenseRecommendationsProps {
  transactions: Transaction[];
  monthlyGoal: number;
}

export const ExpenseRecommendations = ({ transactions, monthlyGoal }: ExpenseRecommendationsProps) => {
  // Calculate current month expenses by category
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && 
           tDate.getFullYear() === currentYear && 
           t.amount < 0;
  });

  // Calculate category totals
  const categoryTotals = EXPENSE_CATEGORIES.map(category => {
    const total = currentMonthExpenses
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return { category, total };
  }).filter(c => c.total > 0);

  // Calculate recommended amounts based on typical spending patterns
  const getRecommendedAmount = (category: string, currentAmount: number) => {
    const baseRecommendations: Record<string, number> = {
      'Food': monthlyGoal * 0.25,
      'Transportation': monthlyGoal * 0.15,
      'Entertainment': monthlyGoal * 0.10,
      'Shopping': monthlyGoal * 0.20,
      'Bills': monthlyGoal * 0.20,
      'Healthcare': monthlyGoal * 0.05,
      'Education': monthlyGoal * 0.03,
      'Other': monthlyGoal * 0.02
    };
    
    return baseRecommendations[category] || monthlyGoal * 0.10;
  };

  // Generate recommendations
  const recommendations: ExpenseRecommendation[] = categoryTotals.map(({ category, total }) => {
    const recommended = getRecommendedAmount(category, total);
    const percentage = (total / recommended) * 100;
    
    let status: 'under' | 'over' | 'optimal' = 'optimal';
    if (percentage < 80) status = 'under';
    else if (percentage > 120) status = 'over';
    
    return {
      category,
      recommendedAmount: recommended,
      currentAmount: total,
      percentage,
      status
    };
  });

  // Sort by priority (over budget first, then under budget)
  const sortedRecommendations = recommendations.sort((a, b) => {
    if (a.status === 'over' && b.status !== 'over') return -1;
    if (a.status !== 'over' && b.status === 'over') return 1;
    return b.percentage - a.percentage;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'under':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'under':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getAdvice = (recommendation: ExpenseRecommendation) => {
    if (recommendation.status === 'over') {
      return `Consider reducing ${recommendation.category.toLowerCase()} spending by ₹${(recommendation.currentAmount - recommendation.recommendedAmount).toFixed(0)} this month.`;
    } else if (recommendation.status === 'under') {
      return `You're doing well with ${recommendation.category.toLowerCase()} spending. You can spend up to ₹${(recommendation.recommendedAmount - recommendation.currentAmount).toFixed(0)} more.`;
    } else {
      return `Your ${recommendation.category.toLowerCase()} spending is well-balanced.`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Smart Spending Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Based on your spending patterns and monthly budget, here are personalized recommendations to help you stay on track.
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {sortedRecommendations.length > 0 ? (
        <div className="space-y-3">
          {sortedRecommendations.map((recommendation) => (
            <Card key={recommendation.category} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(recommendation.status)}
                    <h3 className="font-semibold">{recommendation.category}</h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(recommendation.status)}`}
                  >
                    {recommendation.status === 'over' ? 'Over Budget' : 
                     recommendation.status === 'under' ? 'Under Budget' : 'Optimal'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <div className="font-semibold">₹{recommendation.currentAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recommended:</span>
                      <div className="font-semibold">₹{recommendation.recommendedAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{recommendation.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(recommendation.percentage, 100)} 
                      className="h-2" 
                    />
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    💡 {getAdvice(recommendation)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">
              No spending data available for this month yet. 
              Add some transactions to get personalized recommendations.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {sortedRecommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Categories over budget:</span>
                <span className="font-medium text-red-600">
                  {sortedRecommendations.filter(r => r.status === 'over').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Categories under budget:</span>
                <span className="font-medium text-blue-600">
                  {sortedRecommendations.filter(r => r.status === 'under').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Optimal spending:</span>
                <span className="font-medium text-green-600">
                  {sortedRecommendations.filter(r => r.status === 'optimal').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
