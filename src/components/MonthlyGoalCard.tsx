import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Trophy, TrendingUp } from "lucide-react";
import { MonthlyGoal } from "@/types";

interface MonthlyGoalCardProps {
  goal: MonthlyGoal;
  onUpdateGoal: (goalId: string, targetAmount: number) => void;
}

export const MonthlyGoalCard = ({ goal, onUpdateGoal }: MonthlyGoalCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount.toString());

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isOverBudget = goal.currentAmount > goal.targetAmount;
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  const handleSave = () => {
    const amount = parseFloat(targetAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateGoal(goal.id, amount);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTargetAmount(goal.targetAmount.toString());
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Monthly Goal
          </CardTitle>
          <Badge variant={goal.isAchieved ? "default" : "secondary"}>
            {goal.isAchieved ? "Achieved" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(goal.month + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor="targetAmount">Monthly Budget Goal</Label>
              <Input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Enter target amount"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">Save</Button>
              <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target Amount</span>
              <span className="font-semibold">₹{goal.targetAmount.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current Spending</span>
                <span className={isOverBudget ? "text-destructive" : "text-foreground"}>
                  ₹{goal.currentAmount.toLocaleString()}
                </span>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progress.toFixed(1)}% of goal</span>
                <span>
                  {isOverBudget 
                    ? `₹${Math.abs(remainingAmount).toLocaleString()} over budget`
                    : `₹${remainingAmount.toLocaleString()} remaining`
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  {goal.rewardPoints} points earned
                </span>
              </div>
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline" 
                size="sm"
              >
                Edit Goal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
