import { CreditCard } from "lucide-react";

interface VirtualCardProps {
  cardNumber: string;
  holderName: string;
  className?: string;
}

export const VirtualCard = ({ 
  cardNumber, 
  holderName, 
  className = "" 
}: VirtualCardProps) => {
  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-card p-6 shadow-card ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20" />
        <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-white/10" />
      </div>
      
      {/* Card Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <CreditCard className="h-8 w-8 text-white" />
          <div className="flex gap-1">
            <div className="h-6 w-6 rounded-full bg-red-500 opacity-80" />
            <div className="h-6 w-6 rounded-full bg-orange-400 opacity-80 -ml-2" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-white/90 text-lg font-mono tracking-widest">
            {formatCardNumber(cardNumber)}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">
                Cardholder Name
              </div>
              <div className="text-white font-semibold">
                {holderName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">
                Valid Thru
              </div>
              <div className="text-white font-mono">
                12/28
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};