
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  Clock, 
  Target,
  PieChart,
  Activity,
  Users,
  Truck,
  Route,
  Download,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  fleetPerformance: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    fuelEfficiency: number;
    averageSpeed: number;
    onTimeDelivery: number;
    customerSatisfaction: number;
  };
  trends: {
    revenueGrowth: number;
    costReduction: number;
    efficiencyImprovement: number;
    safetyScore: number;
  };
  breakdown: {
    revenueByService: any[];
    expensesByCategory: any[];
    performanceByVehicle: any[];
    utilizationByDriver: any[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    fleetPerformance: {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      fuelEfficiency: 0,
      averageSpeed: 0,
      onTimeDelivery: 0,
      customerSatisfaction: 0
    },
    trends: {
      revenueGrowth: 0,
      costReduction: 0,
      efficiencyImprovement: 0,
      safetyScore: 0
    },
    breakdown: {
      revenueByService: [],
      expensesByCategory: [],
      performanceByVehicle: [],
      utilizationByDriver: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      // Mock analytics data - in real implementation, this would come from APIs
      const mockData: AnalyticsData = {
        fleetPerformance: {
          totalRevenue: 125000 + Math.random() * 25000,
          totalExpenses: 89500 + Math.random() * 15000,
          netProfit: 35500 + Math.random() * 10000,
          profitMargin: 28.4 + Math.random() * 5,
          fuelEfficiency: 7.2 + Math.random() * 1.5,
          averageSpeed: 65 + Math.random() * 10,
          onTimeDelivery: 94.5 + Math.random() * 5,
          customerSatisfaction: 4.6 + Math.random() * 0.4
        },
        trends: {
          revenueGrowth: 12.5 + Math.random() * 5,
          costReduction: 8.3 + Math.random() * 3,
          efficiencyImprovement: 15.2 + Math.random() * 5,
          safetyScore: 96.8 + Math.random() * 3
        },
        breakdown: {
          revenueByService: [
            { name: 'Freight Delivery', value: 65000, percentage: 52 },
            { name: 'Express Shipping', value: 35000, percentage: 28 },
            { name: 'Local Transport', value: 25000, percentage: 20 }
          ],
          expensesByCategory: [
            { name: 'Fuel', value: 35000, percentage: 39 },
            { name: 'Maintenance', value: 22000, percentage: 25 },
            { name: 'Insurance', value: 15000, percentage: 17 },
            { name: 'Driver Wages', value: 12000, percentage: 13 },
            { name: 'Other', value: 5500, percentage: 6 }
          ],
          performanceByVehicle: [
            { id: 'VH001', efficiency: 95, revenue: 25000, trips: 45 },
            { id: 'VH002', efficiency: 88, revenue: 22000, trips: 38 },
            { id: 'VH003', efficiency: 92, revenue: 28000, trips: 52 },
            { id: 'VH004', efficiency: 85, revenue: 19000, trips: 35 },
            { id: 'VH005', efficiency: 90, revenue: 31000, trips: 48 }
          ],
          utilizationByDriver: [
            { id: 'DR001', name: 'John Smith', hours: 168, efficiency: 94, rating: 4.8 },
            { id: 'DR002', name: 'Sarah Johnson', hours: 156, efficiency: 91, rating: 4.6 },
            { id: 'DR003', name: 'Mike Wilson', hours: 172, efficiency: 89, rating: 4.7 },
            { id: 'DR004', name: 'Lisa Brown', hours: 164, efficiency: 93, rating: 4.9 },
            { id: 'DR005', name: 'David Lee', hours: 148, efficiency: 87, rating: 4.5 }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ icon: Icon, title, value, unit, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </div>
          {trend && (
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}% from last period
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Comprehensive performance analytics and business intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedPeriod}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${Math.round(analyticsData.fleetPerformance.totalRevenue).toLocaleString()}`}
          color="text-green-600"
          trend={analyticsData.trends.revenueGrowth}
        />
        <MetricCard
          icon={TrendingUp}
          title="Net Profit"
          value={`$${Math.round(analyticsData.fleetPerformance.netProfit).toLocaleString()}`}
          color="text-blue-600"
          trend={analyticsData.trends.revenueGrowth - 5}
        />
        <MetricCard
          icon={Fuel}
          title="Fuel Efficiency"
          value={analyticsData.fleetPerformance.fuelEfficiency.toFixed(1)}
          unit="L/100km"
          color="text-orange-600"
          trend={-analyticsData.trends.efficiencyImprovement}
        />
        <MetricCard
          icon={Target}
          title="On-time Delivery"
          value={analyticsData.fleetPerformance.onTimeDelivery.toFixed(1)}
          unit="%"
          color="text-purple-600"
          trend={2.3}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue by Service
                </CardTitle>
                <CardDescription>Revenue distribution across service types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.breakdown.revenueByService.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full bg-blue-${(index + 1) * 200}`} />
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">${service.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{service.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Expenses by Category
                </CardTitle>
                <CardDescription>Cost breakdown by expense category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.breakdown.expensesByCategory.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full bg-red-${(index + 1) * 100 + 300}`} />
                        <span className="text-sm font-medium">{expense.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">${expense.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{expense.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Performance Trends
              </CardTitle>
              <CardDescription>Month-over-month performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +{analyticsData.trends.revenueGrowth.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Revenue Growth</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    -{analyticsData.trends.costReduction.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Cost Reduction</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    +{analyticsData.trends.efficiencyImprovement.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {analyticsData.trends.safetyScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Safety Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle Performance
              </CardTitle>
              <CardDescription>Individual vehicle performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.breakdown.performanceByVehicle.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Truck className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{vehicle.id}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.trips} trips completed</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{vehicle.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">${vehicle.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <Badge variant={vehicle.efficiency > 90 ? 'default' : 'secondary'}>
                        {vehicle.efficiency > 90 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Driver Utilization
              </CardTitle>
              <CardDescription>Driver performance and utilization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.breakdown.utilizationByDriver.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {driver.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{driver.hours}h</div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{driver.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{driver.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analyticsData.fleetPerformance.profitMargin.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Above industry average of 25%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost per Mile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  $1.85
                </div>
                <p className="text-sm text-muted-foreground">
                  -12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue per Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  $25,000
                </div>
                <p className="text-sm text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>Historical performance data and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Advanced trend analysis charts coming soon...</p>
                <p className="text-sm">Integration with charting library in progress</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
