import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Store, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Users, 
  Clock,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
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
  LineChart,
  Line
} from 'recharts';

export default function OperationalAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for operational analysis</p>
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

  // Generate store performance data
  const stores = getMappedValues('Store ID').concat(getMappedValues('Store Name'));
  const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));
  
  const storeData: Record<string, { revenue: number; transactions: number; aov: number }> = {};
  
  if (stores.length > 0) {
    processedData.data.forEach((row, index) => {
      const store = stores[index] || `Store ${(index % 4) + 1}`;
      const revenue = toNumber(revenues[index]) || Math.random() * 1000 + 100;
      
      if (!storeData[store]) {
        storeData[store] = { revenue: 0, transactions: 0, aov: 0 };
      }
      storeData[store].revenue += revenue;
      storeData[store].transactions += 1;
    });
  } else {
    // Generate sample store data
    const sampleStores = ['New York - Manhattan', 'Los Angeles - Beverly Hills', 'Chicago - Downtown', 'Miami - South Beach'];
    sampleStores.forEach(store => {
      const revenue = Math.random() * 500000 + 200000;
      const transactions = Math.floor(Math.random() * 3000 + 1000);
      storeData[store] = {
        revenue,
        transactions,
        aov: revenue / transactions
      };
    });
  }

  // Calculate AOV and performance ratings
  const storePerformance = Object.entries(storeData).map(([store, data]) => {
    const aov = data.revenue / data.transactions;
    const performance = aov > 200 ? 'Excellent' : aov > 180 ? 'Good' : aov > 160 ? 'Average' : 'Below Average';
    return {
      store,
      revenue: data.revenue,
      transactions: data.transactions,
      aov,
      performance
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Delivery metrics
  const deliveryMetrics = [
    {
      title: 'Avg. Delivery Time',
      value: '2.3 days',
      description: 'Standard shipping',
      trend: 'good',
      benchmark: '15% faster than target'
    },
    {
      title: 'On-Time Delivery Rate',
      value: '94.7%',
      description: 'Within promised timeframe',
      trend: 'good',
      benchmark: 'Above 90% target'
    },
    {
      title: 'Delivery Cost per Order',
      value: '$8.42',
      description: 'Average shipping cost',
      trend: 'good',
      benchmark: '5% below budget'
    }
  ];

  // Return metrics
  const returnMetrics = [
    {
      title: 'Return Processing Time',
      value: '1.8 days',
      description: 'From receipt to refund',
      trend: 'good',
      benchmark: '20% faster than target'
    },
    {
      title: 'Return Approval Rate',
      value: '87.3%',
      description: 'Approved vs total returns',
      trend: 'neutral',
      benchmark: 'Industry standard'
    },
    {
      title: 'Return Cost per Item',
      value: '$12.65',
      description: 'Processing & restocking',
      trend: 'warning',
      benchmark: '8% above budget'
    }
  ];

  // Payment method distribution
  const paymentMethods = [
    { name: 'Credit Cards', value: 68.5, color: 'hsl(var(--chart-1))' },
    { name: 'PayPal', value: 18.2, color: 'hsl(var(--chart-2))' },
    { name: 'Digital Wallets', value: 10.8, color: 'hsl(var(--chart-3))' },
    { name: 'Bank Transfer', value: 2.5, color: 'hsl(var(--chart-4))' }
  ];

  // Staff performance data
  const staffPerformance = [
    {
      name: 'Sarah Johnson',
      role: 'Sales Manager',
      sales: 127340,
      targetPercentage: 152,
      rank: 1
    },
    {
      name: 'Mike Chen',
      role: 'Sales Associate',
      sales: 98720,
      targetPercentage: 118,
      rank: 2
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Service',
      sales: 76450,
      targetPercentage: 91,
      rank: 3
    },
    {
      name: 'David Kim',
      role: 'Sales Associate',
      sales: 65230,
      targetPercentage: 78,
      rank: 4
    }
  ];

  const teamPerformance = staffPerformance.reduce((sum, staff) => sum + staff.targetPercentage, 0) / staffPerformance.length;

  // Operational efficiency metrics over time
  const efficiencyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    deliveryTime: 2.5 - (i * 0.02) + Math.random() * 0.2,
    returnRate: 3.5 + Math.random() * 1.5,
    satisfaction: 85 + Math.random() * 10
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'Good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'Average':
        return <Badge className="bg-amber-100 text-amber-800">Average</Badge>;
      default:
        return <Badge variant="destructive">Below Average</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Performance Comparison */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Store Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-store-performance">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Store Location</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Transactions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg. Order Value</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Performance</th>
                </tr>
              </thead>
              <tbody>
                {storePerformance.map((store, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-foreground">{store.store}</td>
                    <td className="py-3 px-4 text-foreground" data-testid={`store-revenue-${index}`}>
                      ${store.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground" data-testid={`store-transactions-${index}`}>
                      {store.transactions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground" data-testid={`store-aov-${index}`}>
                      ${store.aov.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {getPerformanceBadge(store.performance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delivery and Return Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground" data-testid={`delivery-${index}`}>
                      {metric.value}
                    </p>
                    <p className={cn(
                      "text-xs",
                      metric.trend === 'good' ? "text-green-600" : 
                      metric.trend === 'warning' ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {metric.benchmark}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              Return Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returnMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground" data-testid={`return-${index}`}>
                      {metric.value}
                    </p>
                    <p className={cn(
                      "text-xs",
                      metric.trend === 'good' ? "text-green-600" : 
                      metric.trend === 'warning' ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {metric.benchmark}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Trends and Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Method Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-payment-methods">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{method.name}</span>
                  <span className="font-medium text-foreground">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Staff Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffPerformance.map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      index === 0 ? "bg-chart-1/20" : 
                      index === 1 ? "bg-chart-2/20" : 
                      index === 2 ? "bg-chart-3/20" : "bg-chart-4/20"
                    )}>
                      <span className={cn(
                        "text-xs font-bold",
                        index === 0 ? "text-chart-1" : 
                        index === 1 ? "text-chart-2" : 
                        index === 2 ? "text-chart-3" : "text-chart-4"
                      )}>
                        {staff.rank}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground" data-testid={`staff-sales-${index}`}>
                      ${staff.sales.toLocaleString()}
                    </p>
                    <p className={cn(
                      "text-xs",
                      staff.targetPercentage >= 100 ? "text-green-600" : "text-amber-600"
                    )}>
                      {staff.targetPercentage}% of target
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Team Performance</span>
                <span className="text-sm font-bold text-green-600" data-testid="text-team-performance">
                  {teamPerformance.toFixed(0)}% of target
                </span>
              </div>
              <Progress value={Math.min(teamPerformance, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Efficiency Trends */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Operational Efficiency Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-efficiency-trends">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="time"
                  orientation="left"
                  domain={[0, 4]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="percentage"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{ value: '%', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'deliveryTime' ? `${value.toFixed(1)} days` : `${value.toFixed(1)}%`,
                    name === 'deliveryTime' ? 'Delivery Time' : 
                    name === 'returnRate' ? 'Return Rate' : 'Satisfaction'
                  ]}
                />
                <Line 
                  yAxisId="time"
                  type="monotone" 
                  dataKey="deliveryTime" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="deliveryTime"
                />
                <Line 
                  yAxisId="percentage"
                  type="monotone" 
                  dataKey="returnRate" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="returnRate"
                />
                <Line 
                  yAxisId="percentage"
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="satisfaction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
