import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { DailyExpense, Transaction } from "@/types";

interface DailyExpenseTrackerProps {
  dailyExpenses: DailyExpense[];
  monthlyGoal: number;
}

export const DailyExpenseTracker = ({ dailyExpenses, monthlyGoal }: DailyExpenseTrackerProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayExpense = dailyExpenses.find(d => d.date === today);
  
  // Calculate daily average for the month
  const currentMonthExpenses = dailyExpenses.filter(d => {
    const expenseDate = new Date(d.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  });
  
  const totalMonthExpense = currentMonthExpenses.reduce((sum, d) => sum + d.totalAmount, 0);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const dailyAverage = totalMonthExpense / currentDay;
  const projectedMonthlyExpense = dailyAverage * daysInMonth;
  
  // Calculate recommended daily spending
  const remainingDays = daysInMonth - currentDay;
  const remainingBudget = monthlyGoal - totalMonthExpense;
  const recommendedDaily = remainingBudget / remainingDays;

  return (
    <div className="space-y-4">
      {/* Today's Spending */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Today's Spending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayExpense ? (
            <>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  ₹{todayExpense.totalAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total spent today
                </div>
                <Badge 
                  variant={todayExpense.isUnderBudget ? "default" : "destructive"}
                  className={todayExpense.isUnderBudget ? "bg-green-100 text-green-800" : ""}
                >
                  {todayExpense.isUnderBudget ? "Under Budget" : "Over Budget"}
                </Badge>
              </div>
              
              {todayExpense.transactions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Today's Transactions:</div>
                  <div className="space-y-1">
                    {todayExpense.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>{transaction.category}</span>
                        <span className="font-medium">₹{Math.abs(transaction.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No expenses recorded today
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₹{dailyAverage.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₹{projectedMonthlyExpense.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Projected Monthly</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Monthly Goal</span>
              <span className="font-medium">₹{monthlyGoal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Spent So Far</span>
              <span className="font-medium">₹{totalMonthExpense.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Remaining Budget</span>
              <span className={`font-medium ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{remainingBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Recommendation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            Daily Spending Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold text-primary">
              ₹{Math.max(0, recommendedDaily).toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Recommended daily spending to stay within budget
            </div>
            {remainingBudget < 0 ? (
              <Badge variant="destructive">
                Monthly budget exceeded
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-100 text-green-800">
                On track with budget
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
