import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from "lucide-react";

interface ChartData {
  month: string;
  amount: number;
  fullMonth: string;
  income?: number;
  expenses?: number;
  savings?: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface EnhancedExpenseChartProps {
  data: ChartData[];
  categoryData: CategoryData[];
  highlightedMonth: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

export const EnhancedExpenseChart = ({ data, categoryData, highlightedMonth }: EnhancedExpenseChartProps) => {
  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);
  const averageExpense = totalExpenses / data.length;
  const trend = data[data.length - 1]?.amount > data[data.length - 2]?.amount ? 'up' : 'down';
  const trendPercentage = data.length > 1 ? 
    ((data[data.length - 1]?.amount - data[data.length - 2]?.amount) / data[data.length - 2]?.amount * 100).toFixed(1) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Expense Analytics</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: ₹{totalExpenses.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Avg: ₹{averageExpense.toFixed(0)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-500" />
          )}
          <span>
            {trend === 'up' ? '+' : ''}{trendPercentage}% from last month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Bar
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Line
            </TabsTrigger>
            <TabsTrigger value="area" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Area
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Pie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="area" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Category Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category, index) => (
                <div key={category.category} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{category.category}</span>
                  <span className="text-muted-foreground text-xs">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Monthly Breakdown */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">Monthly Breakdown</h4>
          <div className="space-y-2">
            {data.map((item) => (
              <div 
                key={item.month} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  item.month === highlightedMonth 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/30'
                }`}
              >
                <span className="font-medium">{item.fullMonth}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    ₹{item.amount.toLocaleString()}
                  </span>
                  {item.month === highlightedMonth && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
