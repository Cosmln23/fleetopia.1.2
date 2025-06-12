'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Target,
  Zap,
  Brain,
  Eye,
  Download,
  Calendar,
  Users,
  Truck,
  Fuel,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  performance: {
    fleetEfficiency: number;
    fuelSavings: number;
    timeOptimization: number;
    costReduction: number;
    customerSatisfaction: number;
  };
  predictions: {
    nextWeekSavings: number;
    maintenanceAlerts: number;
    routeOptimizations: number;
    efficiency: number;
  };
  trends: {
    dailyRequests: number[];
    weeklyRevenue: number[];
    monthlyGrowth: number;
    userRetention: number;
  };
  insights: {
    topAgent: string;
    bestRoute: string;
    peakHours: string;
    recommendations: string[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    performance: {
      fleetEfficiency: 0, // Real data - no efficiency calculated yet
      fuelSavings: 0, // Real data - no savings yet
      timeOptimization: 0, // Real data - no optimization yet
      costReduction: 0, // Real data - no cost reduction yet
      customerSatisfaction: 0 // Real data - no customers yet
    },
    predictions: {
      nextWeekSavings: 0, // Real data - no predictions yet
      maintenanceAlerts: 0, // Real data - no alerts yet
      routeOptimizations: 0, // Real data - no optimizations yet
      efficiency: 0 // Real data - no efficiency data yet
    },
    trends: {
      dailyRequests: [0, 0, 0, 0, 0, 0, 0], // Real data - no requests yet
      weeklyRevenue: [0, 0, 0, 0], // Real data - no revenue yet
      monthlyGrowth: 0, // Real data - no growth data yet
      userRetention: 0 // Real data - no user data yet
    },
    insights: {
      topAgent: 'No agents deployed yet',
      bestRoute: 'No routes optimized yet',
      peakHours: 'No data available',
      recommendations: [
        'Add your first vehicle to the fleet',
        'Deploy AI agents from the marketplace',
        'Configure route optimization settings',
        'Set up real-time monitoring'
      ]
    }
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time updates every 60 seconds
    const updateTimer = setInterval(fetchAnalyticsData, 60000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      
      // Update state with real data from API
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
      // Keep existing state on error, don't reset
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon, 
    color, 
    description 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    trend?: number;
    icon: any;
    color: string;
    description?: string;
  }) => (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-slate-400">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Analytics & Insights
              </h1>
              <p className="text-slate-400 text-lg">
                AI-powered analytics for fleet optimization and performance tracking
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedTimeframe === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('day')}
                >
                  Day
                </Button>
                <Button
                  variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('week')}
                >
                  Week
                </Button>
                <Button
                  variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('month')}
                >
                  Month
                </Button>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Fleet Efficiency"
            value={analyticsData.performance.fleetEfficiency > 0 ? analyticsData.performance.fleetEfficiency.toFixed(1) : "0"}
            unit="%"
            trend={analyticsData.performance.fleetEfficiency > 0 ? Math.round(analyticsData.trends.monthlyGrowth / 8) : undefined}
            icon={Target}
            color="bg-blue-500"
            description={analyticsData.performance.fleetEfficiency > 0 ? "Overall fleet performance" : "Deploy vehicles to track efficiency"}
          />
          <MetricCard
            title="Cost Savings"
            value={analyticsData.performance.fuelSavings > 0 ? `€${(analyticsData.performance.fuelSavings / 1000).toFixed(0)}K` : "€0"}
            trend={analyticsData.performance.fuelSavings > 0 ? Math.round(analyticsData.trends.monthlyGrowth / 1.5) : undefined}
            icon={DollarSign}
            color="bg-green-500"
            description={analyticsData.performance.fuelSavings > 0 ? "Total savings this month" : "Start optimizing to see savings"}
          />
          <MetricCard
            title="Time Optimization"
            value={analyticsData.performance.timeOptimization > 0 ? analyticsData.performance.timeOptimization.toFixed(1) : "0"}
            unit="%"
            trend={analyticsData.performance.timeOptimization > 0 ? Math.round(analyticsData.trends.monthlyGrowth / 3.3) : undefined}
            icon={Clock}
            color="bg-purple-500"
            description={analyticsData.performance.timeOptimization > 0 ? "Delivery time improvement" : "Add routes to optimize delivery times"}
          />
          <MetricCard
            title="Customer Satisfaction"
            value={analyticsData.performance.customerSatisfaction > 0 ? analyticsData.performance.customerSatisfaction.toFixed(1) : "0"}
            unit="/5.0"
            trend={analyticsData.performance.customerSatisfaction > 0 ? Math.round(analyticsData.trends.userRetention / 80) : undefined}
            icon={Award}
            color="bg-yellow-500"
            description={analyticsData.performance.customerSatisfaction > 0 ? "Average customer rating" : "Serve customers to track satisfaction"}
          />
        </motion.div>

        {/* Main Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
              <TabsTrigger value="insights">Smart Insights</TabsTrigger>
              <TabsTrigger value="reports">Custom Reports</TabsTrigger>
            </TabsList>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Performance Overview */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                      Performance Overview
                    </CardTitle>
                    <CardDescription>Real-time fleet performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Fleet Utilization</span>
                          <span className="text-green-400 font-bold">
                            {analyticsData.performance.fleetEfficiency > 0 ? `${analyticsData.performance.fleetEfficiency}%` : '0%'}
                          </span>
                        </div>
                        <Progress value={analyticsData.performance.fleetEfficiency || 0} className="h-3" />
                        {analyticsData.performance.fleetEfficiency === 0 && (
                          <p className="text-xs text-slate-500 mt-1">Add vehicles to track utilization</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Route Efficiency</span>
                          <span className="text-blue-400 font-bold">
                            {analyticsData.performance.timeOptimization > 0 ? `${analyticsData.performance.timeOptimization}%` : '0%'}
                          </span>
                        </div>
                        <Progress value={analyticsData.performance.timeOptimization || 0} className="h-3" />
                        {analyticsData.performance.timeOptimization === 0 && (
                          <p className="text-xs text-slate-500 mt-1">Configure routes to track efficiency</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Fuel Optimization</span>
                          <span className="text-purple-400 font-bold">
                            {analyticsData.performance.costReduction > 0 ? `${analyticsData.performance.costReduction}%` : '0%'}
                          </span>
                        </div>
                        <Progress value={analyticsData.performance.costReduction || 0} className="h-3" />
                        {analyticsData.performance.costReduction === 0 && (
                          <p className="text-xs text-slate-500 mt-1">Start tracking fuel to see optimization</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Driver Performance</span>
                          <span className="text-yellow-400 font-bold">0%</span>
                        </div>
                        <Progress value={0} className="h-3" />
                        <p className="text-xs text-slate-500 mt-1">Hire drivers to track performance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Traffic & Usage */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Traffic & Usage
                    </CardTitle>
                    <CardDescription>API requests and system usage patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            {analyticsData.trends.dailyRequests[analyticsData.trends.dailyRequests.length - 1].toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-400">Requests Today</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-400">{analyticsData.trends.monthlyGrowth}%</p>
                          <p className="text-sm text-slate-400">Monthly Growth</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-400">{analyticsData.trends.userRetention}%</p>
                          <p className="text-sm text-slate-400">User Retention</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-400">0ms</p>
                          <p className="text-sm text-slate-400">Avg Response</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Truck className="w-5 h-5 mr-2 text-blue-400" />
                      Vehicle Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Vehicles</span>
                        <span className="text-green-400 font-bold">0/0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">In Maintenance</span>
                        <span className="text-yellow-400 font-bold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Available</span>
                        <span className="text-blue-400 font-bold">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Fuel className="w-5 h-5 mr-2 text-yellow-400" />
                      Fuel Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Consumption</span>
                        <span className="text-green-400 font-bold">
                          {analyticsData.performance.fuelSavings > 0 ? "12.4L/100km" : "0 L/100km"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Savings</span>
                        <span className="text-blue-400 font-bold">
                          €{analyticsData.performance.fuelSavings > 0 ? (analyticsData.performance.fuelSavings / 1000).toFixed(0) : "0"}K
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficiency Gain</span>
                        <span className="text-purple-400 font-bold">
                          {analyticsData.performance.fleetEfficiency > 0 ? "+8.3%" : "0%"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Users className="w-5 h-5 mr-2 text-purple-400" />
                      Driver Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Drivers</span>
                        <span className="text-green-400 font-bold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Safety Score</span>
                        <span className="text-blue-400 font-bold">0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Rating</span>
                        <span className="text-purple-400 font-bold">0/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Predictions Tab */}
            <TabsContent value="predictions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      AI Predictions
                    </CardTitle>
                    <CardDescription>Machine learning insights for next week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">€{(analyticsData.predictions.nextWeekSavings / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-slate-400">Predicted Savings</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-400">{analyticsData.predictions.efficiency}%</p>
                        <p className="text-sm text-slate-400">Efficiency Target</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-400">{analyticsData.predictions.maintenanceAlerts}</p>
                        <p className="text-sm text-slate-400">Maintenance Alerts</p>
                      </div>
                      <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-400">{analyticsData.predictions.routeOptimizations}</p>
                        <p className="text-sm text-slate-400">Route Optimizations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Predicted maintenance and optimization opportunities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-2">No upcoming events</p>
                        <p className="text-sm text-slate-500">Events will appear as your fleet becomes active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Smart Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Best AI Agent</p>
                      <p className="text-lg font-semibold text-green-400">{analyticsData.insights.topAgent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Most Efficient Route</p>
                      <p className="text-lg font-semibold text-blue-400">{analyticsData.insights.bestRoute}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Peak Activity</p>
                      <p className="text-lg font-semibold text-purple-400">{analyticsData.insights.peakHours}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>Smart suggestions to improve fleet performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.insights.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm text-white">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Custom Reports</CardTitle>
                  <CardDescription>Generate detailed reports for stakeholders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <BarChart3 className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Advanced Reporting Suite</h3>
                    <p className="text-slate-400 mb-6">
                      Create custom reports with advanced filtering and export options
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Templates
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
