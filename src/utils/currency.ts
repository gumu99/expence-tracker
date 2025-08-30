// Indian Rupee formatting utility
export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0.00';
  
  // Convert to absolute value for formatting
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  
  // Format with Indian numbering system
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const formatted = formatter.format(absAmount);
  return isNegative ? `-${formatted}` : formatted;
};

// Format large numbers with crore/lakh labels
export const formatINRCompact = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  
  let formatted: string;
  
  if (absAmount >= 10000000) { // 1 crore
    formatted = `₹${(absAmount / 10000000).toFixed(1)}Cr`;
  } else if (absAmount >= 100000) { // 1 lakh
    formatted = `₹${(absAmount / 100000).toFixed(1)}L`;
  } else if (absAmount >= 1000) { // 1 thousand
    formatted = `₹${(absAmount / 1000).toFixed(1)}K`;
  } else {
    formatted = `₹${absAmount.toFixed(0)}`;
  }
  
  return isNegative ? `-${formatted}` : formatted;
};

// Parse Indian formatted currency back to number
export const parseINR = (formattedAmount: string): number => {
  const cleanAmount = formattedAmount.replace(/[₹,\s]/g, '');
  return parseFloat(cleanAmount) || 0;
};