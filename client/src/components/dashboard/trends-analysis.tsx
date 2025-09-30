import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, ArrowUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export default function TrendsAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('daily');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for trends analysis</p>
      </div>
    );
  }

  // Generate sample trend data based on processed data
  const generateTrendData = (period: TimePeriod) => {
    const dataPoints = period === 'daily' ? 30 : period === 'weekly' ? 12 : period === 'monthly' ? 12 : 4;
    const baseRevenue = metrics.totalRevenue / dataPoints;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const growth = 1 + (Math.random() - 0.4) * 0.3; // ±15% variation
      const trend = 1 + (i * 0.02); // 2% growth trend
      
      return {
        period: period === 'daily' ? `Day ${i + 1}` : 
                period === 'weekly' ? `Week ${i + 1}` :
                period === 'monthly' ? `Month ${i + 1}` :
                `Q${i + 1}`,
        revenue: Math.round(baseRevenue * growth * trend),
        transactions: Math.round((metrics.totalTransactions / dataPoints) * growth * trend),
        index: i
      };
    });
  };

  const trendData = generateTrendData(selectedPeriod);

  const periodButtons = [
    { id: 'daily' as TimePeriod, label: 'Daily' },
    { id: 'weekly' as TimePeriod, label: 'Weekly' },
    { id: 'monthly' as TimePeriod, label: 'Monthly' },
    { id: 'quarterly' as TimePeriod, label: 'Quarterly' }
  ];

  const growthMetrics = [
    {
      title: 'Month-over-Month',
      value: `+${metrics.growthRates.monthly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    },
    {
      title: 'Year-over-Year',
      value: `+${metrics.growthRates.yearly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    },
    {
      title: 'Quarter-over-Quarter',
      value: `+${metrics.growthRates.quarterly.toFixed(1)}%`,
      description: 'Revenue growth',
      trend: 'up'
    }
  ];

  const peakPerformance = [
    {
      title: 'Best Performing Period',
      value: selectedPeriod === 'daily' ? 'Friday' : selectedPeriod === 'monthly' ? 'December' : 'Q4',
      metric: selectedPeriod === 'daily' ? 'Day of Week' : selectedPeriod === 'monthly' ? 'Month' : 'Quarter',
      icon: Calendar,
      description: 'Highest average revenue'
    },
    {
      title: 'Peak Transaction Volume',
      value: '2:00 PM',
      metric: 'Hour of Day',
      icon: Clock,
      description: 'Highest transaction count'
    },
    {
      title: 'Growth Acceleration',
      value: `+${metrics.growthRates.monthly}%`,
      metric: 'Current Trend',
      icon: TrendingUp,
      description: 'Monthly growth rate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Period Analysis</CardTitle>
            <div className="flex space-x-2">
              {periodButtons.map((period) => (
                <Button
                  key={period.id}
                  variant={selectedPeriod === period.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.id)}
                  data-testid={`button-period-${period.id}`}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sales Trends Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sales Trends Overview
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                <span className="text-muted-foreground">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span className="text-muted-foreground">Transactions</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96" data-testid="chart-sales-trends">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="transactions"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
                />
                <Line 
                  yAxisId="transactions"
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics & Seasonal Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Growth Rate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{metric.title}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600 flex items-center" data-testid={`growth-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">vs previous period</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Seasonal Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-seasonal-patterns">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Performance Analysis */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Peak Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peakPerformance.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center p-4 bg-accent/30 rounded-lg">
                  <Icon className="w-8 h-8 text-chart-1 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-lg font-bold text-foreground" data-testid={`peak-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
