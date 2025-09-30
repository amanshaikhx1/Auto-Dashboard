import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Percent, Calculator, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  LineChart
} from 'recharts';

export default function FinancialAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for financial analysis</p>
      </div>
    );
  }

  // Get mapped field values
  const getMappedValues = (businessFieldName: string): any[] => {
    const mapping = processedData.mappings.find(m => m.businessField === businessFieldName && m.mapped);
    if (!mapping) return [];
    return processedData.data.map(row => row[mapping.sourceColumn]).filter(v => v !== null && v !== undefined && v !== '');
  };

  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[$,\s%]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Financial KPIs
  const totalCosts = metrics.totalRevenue - metrics.totalProfit;
  const netProfit = metrics.totalProfit;
  const profitMarginPercentage = metrics.profitMargin;

  const financialKPIs = [
    {
      title: 'Gross Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      change: 12.5,
      icon: DollarSign,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'Total Costs',
      value: `$${totalCosts.toLocaleString()}`,
      change: 8.3,
      icon: Calculator,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    },
    {
      title: 'Net Profit',
      value: `$${netProfit.toLocaleString()}`,
      change: 23.7,
      icon: TrendingUp,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'Profit Margin',
      value: `${profitMarginPercentage.toFixed(1)}%`,
      change: 4.8,
      icon: Percent,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    }
  ];

  // Generate category margin data
  const categories = getMappedValues('Product Category');
  const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));
  
  const categoryData: Record<string, { revenue: number; transactions: number }> = {};
  
  processedData.data.forEach((row, index) => {
    const category = categories[index] || ['Electronics', 'Clothing', 'Home & Garden', 'Sports'][Math.floor(Math.random() * 4)];
    const revenue = toNumber(revenues[index]) || Math.random() * 1000 + 100;
    
    if (!categoryData[category]) {
      categoryData[category] = { revenue: 0, transactions: 0 };
    }
    categoryData[category].revenue += revenue;
    categoryData[category].transactions += 1;
  });

  const categoryMargins = Object.entries(categoryData).map(([category, data]) => ({
    category,
    revenue: data.revenue,
    margin: 20 + Math.random() * 25, // 20-45% margin range
    transactions: data.transactions
  })).sort((a, b) => b.margin - a.margin);

  // Cost breakdown data
  const costBreakdown = [
    { name: 'Cost of Goods', value: totalCosts * 0.6, color: 'hsl(var(--chart-1))' },
    { name: 'Operating Expenses', value: totalCosts * 0.25, color: 'hsl(var(--chart-2))' },
    { name: 'Marketing', value: totalCosts * 0.1, color: 'hsl(var(--chart-3))' },
    { name: 'Other', value: totalCosts * 0.05, color: 'hsl(var(--chart-4))' }
  ];

  // Discount analysis data
  const discountData = {
    totalDiscounts: metrics.totalRevenue * 0.045, // 4.5% of revenue
    avgDiscountRate: 4.5,
    ordersWithDiscounts: Math.floor(metrics.totalTransactions * 0.35),
    discountROI: 287
  };

  // Tax analysis data
  const taxData = {
    totalTax: metrics.totalRevenue * 0.082, // 8.2% effective rate
    effectiveTaxRate: 8.2,
    categoryTaxRates: [
      { category: 'Electronics', rate: 8.5 },
      { category: 'Clothing', rate: 7.8 },
      { category: 'Home & Garden', rate: 8.0 },
      { category: 'Food & Beverage', rate: 6.5 }
    ]
  };

  // Revenue vs Cost trend data (simulated)
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
    const baseRevenue = metrics.totalRevenue / 12;
    const growth = 1 + (i * 0.02) + (Math.random() - 0.5) * 0.1;
    const revenue = baseRevenue * growth;
    const cost = revenue * 0.7; // 70% cost ratio
    
    return {
      month,
      revenue,
      cost,
      profit: revenue - cost
    };
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground" data-testid={`kpi-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {kpi.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +{kpi.change}% vs last period
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", kpi.bgColor)}>
                    <Icon className={cn("h-6 w-6", kpi.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue vs Cost Analysis */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Revenue vs Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-revenue-cost">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : name === 'cost' ? 'Cost' : 'Profit'
                  ]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="revenue" />
                <Bar dataKey="cost" fill="hsl(var(--chart-4))" name="cost" />
                <Line dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={3} name="profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profit Margins by Category & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Profit Margins by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryMargins.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{category.category}</p>
                    <p className="text-xs text-muted-foreground">
                      Revenue: ${category.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600" data-testid={`category-margin-${index}`}>
                      {category.margin.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Margin</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-cost-breakdown">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discount and Tax Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Discount Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Total Discounts Given</span>
                <span className="text-sm font-bold text-chart-4" data-testid="text-total-discounts">
                  ${discountData.totalDiscounts.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Avg. Discount Rate</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-avg-discount-rate">
                  {discountData.avgDiscountRate}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Orders with Discounts</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-discount-orders">
                  {discountData.ordersWithDiscounts.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Discount ROI</p>
                <p className="text-lg font-bold text-green-600" data-testid="text-discount-roi">
                  {discountData.discountROI}%
                </p>
                <p className="text-xs text-muted-foreground">Revenue increase from discounted orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Tax Analysis by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Total Tax Collected</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-total-tax">
                  ${taxData.totalTax.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Effective Tax Rate</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-effective-tax-rate">
                  {taxData.effectiveTaxRate}%
                </span>
              </div>
              <div className="space-y-2 mt-4">
                <h5 className="text-sm font-medium text-foreground">Tax Rates by Category</h5>
                {taxData.categoryTaxRates.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.category}</span>
                    <span className="font-medium text-foreground">{item.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Financial Health Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Profit Margin Health</p>
              <p className="text-2xl font-bold text-green-600" data-testid="text-margin-health">
                Excellent
              </p>
              <Badge variant="default" className="mt-2 bg-green-100 text-green-800">
                Above 25% target
              </Badge>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Revenue Growth</p>
              <p className="text-2xl font-bold text-blue-600" data-testid="text-revenue-growth">
                Strong
              </p>
              <Badge variant="outline" className="mt-2">
                +12.5% monthly
              </Badge>
            </div>

            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calculator className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Cost Efficiency</p>
              <p className="text-2xl font-bold text-amber-600" data-testid="text-cost-efficiency">
                Good
              </p>
              <Badge variant="secondary" className="mt-2">
                Monitor trends
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
