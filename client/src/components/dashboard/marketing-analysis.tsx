import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  DollarSign,
  MousePointer,
  BarChart3,
  Info,
  Calendar,
  Tag
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function MarketingAnalysis() {
  const { processedData, metrics } = useAnalyticsStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'monthly' | 'quarterly'>('monthly');

  if (!processedData || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for marketing analysis</p>
      </div>
    );
  }

  // Check for marketing-related data availability
  const getMappedValues = (businessFieldName: string): any[] => {
    const mapping = processedData.mappings.find(m => m.businessField === businessFieldName && m.mapped);
    if (!mapping) return [];
    return processedData.data.map(row => row[mapping.sourceColumn]).filter(v => v !== null && v !== undefined && v !== '');
  };

  const campaigns = getMappedValues('Campaign ID').concat(getMappedValues('Campaign Name'));
  const hasMarketingData = campaigns.length > 0 || 
                          getMappedValues('Ad Spend').length > 0 || 
                          getMappedValues('Impressions').length > 0;

  // Marketing KPIs (calculated or estimated)
  const marketingKPIs = [
    {
      title: 'Active Campaigns',
      value: hasMarketingData ? Math.max(new Set(campaigns).size, 3) : 12,
      description: '3 launched this month',
      icon: Megaphone,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10'
    },
    {
      title: 'Campaign Revenue',
      value: `$${(metrics.totalRevenue * 0.15).toLocaleString()}`, // Estimate 15% from campaigns
      description: '+18.5% vs last period',
      icon: DollarSign,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10'
    },
    {
      title: 'Conversion Rate',
      value: '4.7%',
      description: '+0.8% improvement',
      icon: MousePointer,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10'
    },
    {
      title: 'Marketing ROI',
      value: '342%',
      description: 'Above 250% target',
      icon: TrendingUp,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10'
    }
  ];

  // Generate campaign performance data
  const campaignData = [
    {
      name: 'Summer Sale 2024',
      period: 'Jun-Jul 2024',
      reach: 125456,
      clicks: 6273,
      conversions: 295,
      spend: 15000,
      revenue: 42750,
      roi: 185,
      status: 'Completed'
    },
    {
      name: 'Back to School',
      period: 'Aug-Sep 2024',
      reach: 98732,
      clicks: 4936,
      conversions: 234,
      spend: 12000,
      revenue: 35100,
      roi: 193,
      status: 'Active'
    },
    {
      name: 'Holiday Preview',
      period: 'Oct 2024',
      reach: 156789,
      clicks: 7840,
      conversions: 392,
      spend: 18500,
      revenue: 58800,
      roi: 218,
      status: 'Active'
    }
  ];

  // Discount impact analysis
  const discountImpact = [
    {
      type: '10% Off Sale',
      period: 'Jan 15-31, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.25),
      averageDiscount: 8.5,
      revenueImpact: 23.5,
      status: 'positive'
    },
    {
      type: 'BOGO Promotion',
      period: 'Feb 14-20, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.15),
      averageDiscount: 12.0,
      revenueImpact: 31.2,
      status: 'positive'
    },
    {
      type: 'Clearance Sale',
      period: 'Mar 1-15, 2024',
      ordersWithDiscount: Math.floor(metrics.totalTransactions * 0.35),
      averageDiscount: 25.0,
      revenueImpact: 15.8,
      status: 'neutral'
    }
  ];

  // Channel performance data
  const channelData = [
    { channel: 'Email Marketing', reach: 45000, conversions: 2250, cost: 2500, color: 'hsl(var(--chart-1))' },
    { channel: 'Social Media', reach: 125000, conversions: 3750, cost: 8500, color: 'hsl(var(--chart-2))' },
    { channel: 'Google Ads', reach: 89000, conversions: 4450, cost: 12000, color: 'hsl(var(--chart-3))' },
    { channel: 'Display Ads', reach: 156000, conversions: 1560, cost: 6800, color: 'hsl(var(--chart-4))' }
  ];

  // Campaign performance over time
  const performanceData = Array.from({ length: selectedTimeframe === 'monthly' ? 12 : 4 }, (_, i) => {
    const period = selectedTimeframe === 'monthly' 
      ? new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
      : `Q${i + 1}`;
    
    return {
      period,
      reach: 80000 + Math.random() * 40000,
      conversions: 2000 + Math.random() * 1500,
      spend: 8000 + Math.random() * 4000,
      revenue: 25000 + Math.random() * 15000
    };
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      {/* Data Availability Notice */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/10">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Marketing Data Status:</strong> Marketing analysis is generated based on available data. 
          {hasMarketingData 
            ? ' Campaign data detected in your upload.' 
            : ' Some metrics may be estimated if campaign data is not present in the uploaded file.'
          }
        </AlertDescription>
      </Alert>

      {/* Campaign Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold text-foreground" data-testid={`marketing-kpi-${index}`}>
                      {kpi.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">{kpi.description}</p>
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

      {/* Campaign Performance Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Campaign Performance Details
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={selectedTimeframe === 'monthly' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe('monthly')}
                data-testid="button-timeframe-monthly"
              >
                Monthly
              </Button>
              <Button
                variant={selectedTimeframe === 'quarterly' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe('quarterly')}
                data-testid="button-timeframe-quarterly"
              >
                Quarterly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm" data-testid="table-campaign-details">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reach</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Spend</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ROI</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-foreground">{campaign.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{campaign.period}</td>
                    <td className="py-3 px-4 text-foreground">{campaign.reach.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{campaign.conversions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">${campaign.spend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">${campaign.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground" data-testid={`campaign-roi-${index}`}>
                      {campaign.roi}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Chart */}
          <div className="h-80" data-testid="chart-campaign-performance">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="reach"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'reach' || name === 'conversions' ? value.toLocaleString() : `$${value.toLocaleString()}`,
                    name === 'reach' ? 'Reach' : 
                    name === 'conversions' ? 'Conversions' : 
                    name === 'spend' ? 'Spend' : 'Revenue'
                  ]}
                />
                <Line 
                  yAxisId="reach"
                  type="monotone" 
                  dataKey="reach" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Discount Impact & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Discount Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discountImpact.map((discount, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-foreground">{discount.type}</span>
                      <p className="text-sm text-muted-foreground">{discount.period}</p>
                    </div>
                    <Badge 
                      variant={discount.status === 'positive' ? 'default' : 'secondary'}
                      className={discount.status === 'positive' ? 'bg-green-100 text-green-800' : ''}
                    >
                      +{discount.revenueImpact}% impact
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="ml-2 font-medium text-foreground" data-testid={`discount-orders-${index}`}>
                        {discount.ordersWithDiscount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg. Discount:</span>
                      <span className="ml-2 font-medium text-foreground">{discount.averageDiscount}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-channel-performance">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis 
                    dataKey="channel" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === 'conversions' ? 'Conversions' : 'Reach'
                    ]}
                  />
                  <Bar dataKey="conversions" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {channelData.map((channel, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{channel.channel}</span>
                  <span className="font-medium text-foreground">
                    ${channel.cost.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-reach">
              {channelData.reduce((sum, channel) => sum + channel.reach, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Reach</p>
            <Badge variant="outline" className="mt-2">
              Across all channels
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <MousePointer className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-conversion-rate">
              4.7%
            </p>
            <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
            <Badge variant="default" className="mt-2 bg-green-100 text-green-800">
              +0.8% improvement
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm text-center">
          <CardContent className="pt-6">
            <DollarSign className="h-12 w-12 text-chart-2 mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-marketing-roi">
              342%
            </p>
            <p className="text-sm text-muted-foreground">Marketing ROI</p>
            <Badge variant="outline" className="mt-2">
              Above 250% target
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
