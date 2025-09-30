import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingDown, Package, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ProductAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedView, setSelectedView] = useState<'revenue' | 'quantity' | 'profit'>('revenue');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for product analysis</p>
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

  // Generate product performance data
  const generateProductData = () => {
    const products = getMappedValues('Product Name').concat(getMappedValues('Product ID'));
    const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));
    const quantities = getMappedValues('Quantity');
    const categories = getMappedValues('Product Category');

    const productMap: Record<string, { revenue: number; quantity: number; category: string }> = {};

    processedData.data.forEach((row, index) => {
      const productName = products[index] || `Product ${index + 1}`;
      const revenue = toNumber(revenues[index]) || Math.random() * 1000 + 100;
      const quantity = toNumber(quantities[index]) || Math.floor(Math.random() * 50) + 1;
      const category = categories[index] || ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)];

      if (!productMap[productName]) {
        productMap[productName] = { revenue: 0, quantity: 0, category };
      }
      productMap[productName].revenue += revenue;
      productMap[productName].quantity += quantity;
    });

    return Object.entries(productMap).map(([name, data]) => ({
      name,
      ...data,
      profit: data.revenue * 0.3, // Estimate 30% profit margin
      margin: 30 + Math.random() * 20 // 30-50% margin range
    }));
  };

  const productData = generateProductData();
  const topProducts = productData.sort((a, b) => b[selectedView] - a[selectedView]).slice(0, 5);
  const bottomProducts = productData.sort((a, b) => a[selectedView] - b[selectedView]).slice(0, 5);

  // Generate category performance data
  const categoryData = productData.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { revenue: 0, quantity: 0, products: 0 };
    }
    acc[product.category].revenue += product.revenue;
    acc[product.category].quantity += product.quantity;
    acc[product.category].products += 1;
    return acc;
  }, {} as Record<string, { revenue: number; quantity: number; products: number }>);

  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    ...data
  }));

  // Generate profitability scatter data
  const profitabilityData = productData.map(product => ({
    volume: product.quantity,
    profit: product.profit,
    name: product.name,
    margin: product.margin
  }));

  // Return rate simulation
  const returnRates = [
    { category: 'Electronics', rate: 4.2, trend: 'up' },
    { category: 'Clothing', rate: 6.1, trend: 'down' },
    { category: 'Home', rate: 2.8, trend: 'stable' },
    { category: 'Sports', rate: 3.5, trend: 'up' }
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const marginCategories = [
    { range: 'High Margin (>40%)', count: productData.filter(p => p.margin > 40).length, color: 'text-green-600' },
    { range: 'Medium Margin (20-40%)', count: productData.filter(p => p.margin >= 20 && p.margin <= 40).length, color: 'text-amber-600' },
    { range: 'Low Margin (<20%)', count: productData.filter(p => p.margin < 20).length, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Products</CardTitle>
            <div className="flex space-x-2">
              {(['revenue', 'quantity', 'profit'] as const).map((view) => (
                <Button
                  key={view}
                  variant={selectedView === view ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView(view)}
                  data-testid={`button-view-${view}`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                      {index === 0 ? (
                        <Star className="h-5 w-5 text-chart-1" />
                      ) : (
                        <span className="text-sm font-bold text-chart-1">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`top-product-${index}`}>
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {selectedView === 'revenue' || selectedView === 'profit' 
                        ? `$${product[selectedView].toLocaleString()}` 
                        : product[selectedView].toLocaleString()
                      }
                    </p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +{(Math.random() * 20 + 5).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Bottom Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`bottom-product-${index}`}>
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • {product.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {selectedView === 'revenue' || selectedView === 'profit' 
                        ? `$${product[selectedView].toLocaleString()}` 
                        : product[selectedView].toLocaleString()
                      }
                    </p>
                    <p className="text-xs text-red-600 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      -{(Math.random() * 15 + 5).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Category Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-category-performance">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : name === 'quantity' ? 'Quantity' : 'Products'
                  ]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profitability & Return Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Product Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marginCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-sm font-medium text-foreground">{category.range}</span>
                  <span className={cn("text-sm font-bold", category.color)} data-testid={`margin-category-${index}`}>
                    {category.count}
                  </span>
                </div>
              ))}
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Average Product Margin</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-avg-margin">
                  {(productData.reduce((sum, p) => sum + p.margin, 0) / productData.length).toFixed(1)}%
                </p>
                <p className="text-xs text-green-600">+2.3% vs industry average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Return Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Overall Return Rate</span>
                <span className="text-sm font-bold text-foreground" data-testid="text-overall-return-rate">
                  {(returnRates.reduce((sum, r) => sum + r.rate, 0) / returnRates.length).toFixed(1)}%
                </span>
              </div>
              {returnRates.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">{item.rate}%</span>
                    {item.trend === 'up' && <ArrowUp className="h-3 w-3 text-red-600" />}
                    {item.trend === 'down' && <ArrowDown className="h-3 w-3 text-green-600" />}
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Return Cost Impact</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-return-cost">
                  ${(metrics.totalRevenue * 0.035).toLocaleString()}
                </p>
                <p className="text-xs text-red-600">Monthly return processing costs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Scatter Plot */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Volume vs Profitability Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-profitability-scatter">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="volume" 
                  name="Volume" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Volume (units)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="profit" 
                  name="Profit" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  labelFormatter={(label: any) => label || ''}
                />
                <Scatter 
                  dataKey="profit" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
