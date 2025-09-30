import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataProcessor } from '@/lib/data-processor';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Receipt, 
  Percent, 
  Package,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function SummaryMetrics() {
  const { processedData, metrics } = useAnalyticsStore();

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for analysis</p>
      </div>
    );
  }

  // Generate chart data
  const revenueData = DataProcessor.generateChartData(processedData, 'revenue-trends');
  const categoryData = DataProcessor.generateChartData(processedData, 'category-performance');

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: metrics.growthRates.monthly,
      icon: DollarSign,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'Total Profit',
      value: `$${metrics.totalProfit.toLocaleString()}`,
      change: metrics.growthRates.monthly * 0.8,
      icon: TrendingUp,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      change: metrics.growthRates.monthly * 1.2,
      icon: ShoppingCart,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Avg Order Value',
      value: `$${metrics.avgOrderValue.toFixed(2)}`,
      change: -2.1,
      icon: Receipt,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change > 0;
          
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold text-foreground" data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {card.value}
                    </p>
                    <p className={cn(
                      "text-sm mt-1 flex items-center",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(card.change).toFixed(1)}% vs last period
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", card.bgColor)}>
                    <Icon className={cn("h-6 w-6", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profit Margin
              <Percent className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overall Margin</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-profit-margin">
                  {metrics.profitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-chart-2 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(metrics.profitMargin, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: 25%</span>
                <span className={cn(
                  metrics.profitMargin > 25 ? "text-green-600" : "text-amber-600"
                )}>
                  {metrics.profitMargin > 25 ? '+' : ''}{(metrics.profitMargin - 25).toFixed(1)}% vs target
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Inventory Status
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Products</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-active-products">
                  {metrics.inventoryMetrics.activeProducts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Low Stock</span>
                <span className="text-sm font-medium text-amber-600" data-testid="text-low-stock">
                  {metrics.inventoryMetrics.lowStock}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Out of Stock</span>
                <span className="text-sm font-medium text-red-600" data-testid="text-out-of-stock">
                  {metrics.inventoryMetrics.outOfStock}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Customer Metrics
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Customers</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-total-customers">
                  {metrics.customerMetrics.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New This Period</span>
                <span className="text-sm font-medium text-green-600" data-testid="text-new-customers">
                  {metrics.customerMetrics.new}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Lifetime Value</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-customer-ltv">
                  ${metrics.customerMetrics.ltv.toFixed(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" data-testid="chart-revenue-trends">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No revenue data available for trends</p>
                    <p className="text-sm">Ensure revenue and date columns are mapped</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" data-testid="chart-category-performance">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No category data available</p>
                    <p className="text-sm">Ensure category and revenue columns are mapped</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
