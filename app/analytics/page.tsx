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
      fleetEfficiency: 87.3,
      fuelSavings: 31200,
      timeOptimization: 23.4,
      costReduction: 42.1,
      customerSatisfaction: 4.8
    },
    predictions: {
      nextWeekSavings: 8450,
      maintenanceAlerts: 3,
      routeOptimizations: 12,
      efficiency: 91.2
    },
    trends: {
      dailyRequests: [1200, 1350, 1180, 1420, 1560, 1340, 1280],
      weeklyRevenue: [23400, 25600, 28100, 26800],
      monthlyGrowth: 18.7,
      userRetention: 94.2
    },
    insights: {
      topAgent: 'RouteOptimizer Pro',
      bestRoute: 'Berlin → Munich',
      peakHours: '08:00 - 10:00',
      recommendations: [
        'Optimize fuel consumption for Route #34',
        'Schedule maintenance for Vehicle FL-234-AB',
        'Update route planning for rush hour traffic',
        'Implement driver training program'
      ]
    }
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          fleetEfficiency: prev.performance.fleetEfficiency + (Math.random() - 0.5) * 2,
          customerSatisfaction: Math.min(5, Math.max(4, prev.performance.customerSatisfaction + (Math.random() - 0.5) * 0.2))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            value={analyticsData.performance.fleetEfficiency.toFixed(1)}
            unit="%"
            trend={2.3}
            icon={Target}
            color="bg-blue-500"
            description="Overall fleet performance"
          />
          <MetricCard
            title="Cost Savings"
            value={`€${(analyticsData.performance.fuelSavings / 1000).toFixed(0)}K`}
            trend={12.1}
            icon={DollarSign}
            color="bg-green-500"
            description="Total savings this month"
          />
          <MetricCard
            title="Time Optimization"
            value={analyticsData.performance.timeOptimization.toFixed(1)}
            unit="%"
            trend={5.7}
            icon={Clock}
            color="bg-purple-500"
            description="Delivery time improvement"
          />
          <MetricCard
            title="Customer Satisfaction"
            value={analyticsData.performance.customerSatisfaction.toFixed(1)}
            unit="/5.0"
            trend={1.2}
            icon={Award}
            color="bg-yellow-500"
            description="Average customer rating"
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
                          <span className="text-green-400 font-bold">85.9%</span>
                        </div>
                        <Progress value={85.9} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Route Efficiency</span>
                          <span className="text-blue-400 font-bold">92.3%</span>
                        </div>
                        <Progress value={92.3} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Fuel Optimization</span>
                          <span className="text-purple-400 font-bold">78.1%</span>
                        </div>
                        <Progress value={78.1} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400">Driver Performance</span>
                          <span className="text-yellow-400 font-bold">88.7%</span>
                        </div>
                        <Progress value={88.7} className="h-3" />
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
                          <p className="text-2xl font-bold text-yellow-400">142ms</p>
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
                        <span className="text-green-400 font-bold">134/156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">In Maintenance</span>
                        <span className="text-yellow-400 font-bold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Available</span>
                        <span className="text-blue-400 font-bold">10</span>
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
                        <span className="text-green-400 font-bold">12.4L/100km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Savings</span>
                        <span className="text-blue-400 font-bold">€{(analyticsData.performance.fuelSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Efficiency Gain</span>
                        <span className="text-purple-400 font-bold">+8.3%</span>
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
                        <span className="text-green-400 font-bold">134</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Safety Score</span>
                        <span className="text-blue-400 font-bold">94.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Rating</span>
                        <span className="text-purple-400 font-bold">4.6/5</span>
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
                      <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-400">Route Optimization Available</p>
                          <p className="text-xs text-slate-400">3 routes can be improved by 15%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-sm font-medium text-yellow-400">Maintenance Due</p>
                          <p className="text-xs text-slate-400">Vehicle FL-234-AB in 3 days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-400">Fuel Price Drop</p>
                          <p className="text-xs text-slate-400">Expected 8% decrease next week</p>
                        </div>
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
