import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatINR, parseINR } from '@/utils/currency';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface SetupDialogProps {
  open: boolean;
}

export function SetupDialog({ open }: SetupDialogProps) {
  const { setUser } = useApp();
  const [name, setName] = useState('');
  const [salaryInput, setSalaryInput] = useState('');
  const [balanceInput, setBalanceInput] = useState('');
  const [expenseGoalInput, setExpenseGoalInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const salary = parseINR(salaryInput);
    if (!salaryInput || salary <= 0) {
      newErrors.salary = 'Please enter a valid salary';
    }
    
    if (balanceInput && parseINR(balanceInput) < 0) {
      newErrors.balance = 'Initial balance cannot be negative';
    }

    if (expenseGoalInput && parseINR(expenseGoalInput) <= 0) {
      newErrors.expenseGoal = 'Please enter a valid expense goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const user = {
      name: name.trim(),
      salary: parseINR(salaryInput),
      initialBalance: balanceInput ? parseINR(balanceInput) : 0,
      monthlyExpenseGoal: expenseGoalInput ? parseINR(expenseGoalInput) : parseINR(salaryInput) * 0.7, // Default to 70% of salary
      rewardPoints: 0,
      createdAt: new Date().toISOString(),
    };

    setUser(user);
    toast({
      title: "Welcome!",
      description: `Hi ${user.name}, your account has been set up successfully with smart budgeting features!`,
    });
  };

  const handleSalaryChange = (value: string) => {
    setSalaryInput(value);
    if (errors.salary) {
      setErrors(prev => ({ ...prev, salary: '' }));
    }
    
    // Auto-suggest expense goal as 70% of salary
    const salary = parseINR(value);
    if (salary > 0 && !expenseGoalInput) {
      setExpenseGoalInput(formatINR(salary * 0.7));
    }
  };

  const handleBalanceChange = (value: string) => {
    setBalanceInput(value);
    if (errors.balance) {
      setErrors(prev => ({ ...prev, balance: '' }));
    }
  };

  const handleExpenseGoalChange = (value: string) => {
    setExpenseGoalInput(value);
    if (errors.expenseGoal) {
      setErrors(prev => ({ ...prev, expenseGoal: '' }));
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Welcome to Smart Finance Tracker</DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Let's set up your account with intelligent budgeting and rewards
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Monthly Salary</Label>
            <Input
              id="salary"
              placeholder="₹2,00,000"
              value={salaryInput}
              onChange={(e) => handleSalaryChange(e.target.value)}
            />
            {errors.salary && (
              <p className="text-sm text-destructive">{errors.salary}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expenseGoal">Monthly Expense Goal (optional)</Label>
            <Input
              id="expenseGoal"
              placeholder="₹1,40,000 (70% of salary)"
              value={expenseGoalInput}
              onChange={(e) => handleExpenseGoalChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We'll auto-suggest 70% of your salary, but you can adjust this based on your spending habits
            </p>
            {errors.expenseGoal && (
              <p className="text-sm text-destructive">{errors.expenseGoal}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance (optional)</Label>
            <Input
              id="balance"
              placeholder="₹0 (leave empty for 0)"
              value={balanceInput}
              onChange={(e) => handleBalanceChange(e.target.value)}
            />
            {errors.balance && (
              <p className="text-sm text-destructive">{errors.balance}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Get Started with Smart Finance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}