import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { parseINR } from '@/utils/currency';
import { useApp } from '@/context/AppContext';
import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddTransactionDialog({ open, onClose }: AddTransactionDialogProps) {
  const { addTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const parsedAmount = parseINR(amount);
    if (!amount || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const parsedAmount = parseINR(amount);
    const finalAmount = type === 'expense' ? -parsedAmount : parsedAmount;

    addTransaction({
      amount: finalAmount,
      category,
      date,
      description: description.trim() || undefined,
      type,
    });

    toast({
      title: "Transaction Added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of ₹${parsedAmount.toLocaleString('en-IN')} added successfully.`,
    });

    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setType('expense');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label>Transaction Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="₹1,000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
              }}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
              }}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note about this transaction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}