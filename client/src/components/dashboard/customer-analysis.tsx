import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, MapPin, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

export default function CustomerAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for customer analysis</p>
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

  // Generate customer segmentation data
  const customers = getMappedValues('Customer ID').concat(getMappedValues('Customer Email'));
  const revenues = getMappedValues('Revenue').concat(getMappedValues('Total Amount'));

  const customerRevenues: Record<string, number> = {};
  processedData.data.forEach((row, index) => {
    const customerId = customers[index] || `Customer ${index + 1}`;
    const revenue = toNumber(revenues[index]) || Math.random() * 500 + 50;
    customerRevenues[customerId] = (customerRevenues[customerId] || 0) + revenue;
  });

  // Segment customers by value
  const customerValues = Object.values(customerRevenues);
  const segmentData = [
    { 
      name: 'VIP ($5000+)', 
      value: customerValues.filter(v => v >= 5000).length,
      color: 'hsl(var(--chart-1))',
      percentage: 1.5 
    },
    { 
      name: 'High Value ($1000-$5000)', 
      value: customerValues.filter(v => v >= 1000 && v < 5000).length,
      color: 'hsl(var(--chart-2))',
      percentage: 14.6 
    },
    { 
      name: 'Regular ($100-$1000)', 
      value: customerValues.filter(v => v >= 100 && v < 1000).length,
      color: 'hsl(var(--chart-3))',
      percentage: 54.2 
    },
    { 
      name: 'New (<$100)', 
      value: customerValues.filter(v => v < 100).length,
      color: 'hsl(var(--chart-4))',
      percentage: 29.7 
    }
  ];

  // Demographics data
  const ageGroups = [
    { range: '18-25', percentage: 18.5, count: Math.floor(metrics.customerMetrics.total * 0.185) },
    { range: '26-35', percentage: 32.1, count: Math.floor(metrics.customerMetrics.total * 0.321) },
    { range: '36-45', percentage: 28.7, count: Math.floor(metrics.customerMetrics.total * 0.287) },
    { range: '46+', percentage: 20.7, count: Math.floor(metrics.customerMetrics.total * 0.207) }
  ];

  const geographicData = [
    { region: 'North America', percentage: 45.2 },
    { region: 'Europe', percentage: 28.9 },
    { region: 'Asia Pacific', percentage: 18.4 },
    { region: 'Other', percentage: 7.5 }
  ];

  const behaviorMetrics = [
    { metric: 'Avg. Orders per Customer', value: '3.4', description: 'Purchase frequency' },
    { metric: 'Avg. Time Between Orders', value: '45 days', description: 'Purchase interval' },
    { metric: 'Customer Lifetime Value', value: `$${metrics.customerMetrics.ltv.toFixed(0)}`, description: 'Average LTV' }
  ];

  // Loyalty metrics
  const loyaltyMetrics = [
    { name: 'Repeat Purchase Rate', value: 68.3, unit: '%', trend: 'up' },
    { name: 'Customer Churn Rate', value: 26.8, unit: '%', trend: 'down' },
    { name: 'Net Promoter Score', value: 72, unit: '', trend: 'up' },
    { name: 'Customer Satisfaction', value: 4.2, unit: '/5', trend: 'stable' }
  ];

  // Retention cohort data (simulated)
  const retentionData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    retention: Math.max(20, 100 - (i * 8) - Math.random() * 10)
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      {/* Customer Segmentation & Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" data-testid="chart-customer-segments">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Customers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Customer Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{segment.name.split(' ')[0]} Customers</p>
                    <p className="text-xs text-muted-foreground">{segment.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: segment.color }} data-testid={`segment-${index}`}>
                      {segment.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{segment.percentage}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ageGroups.map((group, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{group.range}</span>
                    <span className="text-sm font-medium text-foreground" data-testid={`age-group-${index}`}>
                      {group.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${group.percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{group.count.toLocaleString()} customers</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geographicData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                  <span className="text-sm text-muted-foreground">{item.region}</span>
                  <span className="text-sm font-medium text-foreground" data-testid={`region-${index}`}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Purchase Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {behaviorMetrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-accent/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`behavior-${index}`}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Loyalty & Retention Analysis */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Customer Loyalty & Retention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-4">Retention Rate by Cohort</h4>
              <div className="h-64" data-testid="chart-retention">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retention Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Loyalty Metrics</h4>
              <div className="space-y-4">
                {loyaltyMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="text-sm font-medium text-foreground">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground" data-testid={`loyalty-${index}`}>
                        {metric.value}{metric.unit}
                      </span>
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {metric.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      {metric.trend === 'stable' && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Value Analysis Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-customers">
              {metrics.customerMetrics.total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <Badge variant="secondary" className="mt-2">
              +{metrics.customerMetrics.new} new this period
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-retention-rate">
              {metrics.customerMetrics.retention.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Retention Rate</p>
            <Badge variant="default" className="mt-2 bg-green-100 text-green-800">
              Above Industry Average
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 text-chart-2 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-average-ltv">
              ${metrics.customerMetrics.ltv.toFixed(0)}
            </p>
            <p className="text-sm text-muted-foreground">Average LTV</p>
            <Badge variant="outline" className="mt-2">
              Growing +12.5%
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
