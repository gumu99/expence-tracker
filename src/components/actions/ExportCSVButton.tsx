import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';

export function ExportCSVButton() {
  const { transactions } = useApp();

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transactions to export.",
        variant: "destructive",
      });
      return;
    }

    // Prepare CSV headers
    const headers = ['Date', 'Category', 'Amount (₹)', 'Description', 'Type'];
    
    // Prepare CSV rows
    const rows = transactions.map(transaction => [
      transaction.date,
      transaction.category,
      formatINR(Math.abs(transaction.amount)),
      transaction.description || '',
      transaction.type
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${transactions.length} transactions to CSV.`,
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={exportToCSV}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}