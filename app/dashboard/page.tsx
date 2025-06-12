'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Bot, Euro, Fuel, Route, Clock, TrendingUp, Activity } from 'lucide-react';
import MetricCard from '@/components/metric-card';
import DigitalScreen from '@/components/digital-screen';

interface DashboardData {
  activeVehicles: number;
  aiAgentsOnline: number;
  revenueToday: number;
  fuelEfficiency: number;
  totalTrips: number;
  averageDeliveryTime: number;
  costSavings: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activeVehicles: 0,
    aiAgentsOnline: 0,
    revenueToday: 0,
    fuelEfficiency: 0,
    totalTrips: 0,
    averageDeliveryTime: 0,
    costSavings: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 30 seconds
    const updateTimer = setInterval(fetchDashboardData, 30000);

    return () => {
      clearInterval(updateTimer);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      // Handle both empty state and real data
      if (data.isEmpty) {
        setDashboardData({
          activeVehicles: 0,
          aiAgentsOnline: 0,
          revenueToday: 0,
          fuelEfficiency: 0,
          totalTrips: 0,
          averageDeliveryTime: 0,
          costSavings: 0
        });
      } else {
        setDashboardData({
          activeVehicles: data.activeVehicles || 0,
          aiAgentsOnline: data.aiAgentsOnline || 0,
          revenueToday: data.revenueToday || 0,
          fuelEfficiency: data.fuelEfficiency || 0,
          totalTrips: data.totalTrips || 0,
          averageDeliveryTime: data.averageDeliveryTime || 0,
          costSavings: data.costSavings || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Keep showing zeros instead of demo data on error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 matrix-text">Initializing Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-thin text-white mb-2 matrix-text">
            Fleet Control <span className="text-green-400">Center</span>
          </h1>
          <p className="text-gray-400 font-light">
            Real-time monitoring and control of your entire fleet ecosystem
          </p>
        </motion.div>

        {/* Digital Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <DigitalScreen 
            fleetEfficiency={dashboardData.fuelEfficiency}
            aiProcessingRate={dashboardData.aiAgentsOnline * 100} // Convert agents to processing rate
            systemStatus={dashboardData.activeVehicles > 0 ? 'online' : 'offline'}
          />
        </motion.div>

        {/* Main Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Active Vehicles"
            value={dashboardData.activeVehicles}
            subtitle="Currently operational"
            icon={Truck}
            trend={dashboardData.activeVehicles > 0 ? "up" : "neutral"}
            trendValue={dashboardData.activeVehicles > 0 ? `${dashboardData.activeVehicles} online` : "Getting started"}
            animate={true}
          />
          <MetricCard
            title="AI Agents Online"
            value={dashboardData.aiAgentsOnline}
            subtitle="Processing requests"
            icon={Bot}
            trend={dashboardData.aiAgentsOnline > 0 ? "up" : "neutral"}
            trendValue={dashboardData.aiAgentsOnline > 0 ? "Active" : "Deploy agents"}
            animate={true}
          />
          <MetricCard
            title="Revenue Today"
            value={`€${dashboardData.revenueToday.toLocaleString()}`}
            subtitle="Daily earnings"
            icon={Euro}
            trend={dashboardData.revenueToday > 0 ? "up" : "neutral"}
            trendValue={dashboardData.revenueToday > 0 ? "Earning" : "Start operations"}
            animate={true}
          />
          <MetricCard
            title="Fuel Efficiency"
            value={`${dashboardData.fuelEfficiency.toFixed(1)}%`}
            subtitle="Fleet average"
            icon={Fuel}
            trend={dashboardData.fuelEfficiency > 80 ? "up" : dashboardData.fuelEfficiency > 0 ? "neutral" : "neutral"}
            trendValue={dashboardData.fuelEfficiency > 0 ? "Monitoring" : "No data"}
            animate={true}
          />
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <MetricCard
            title="Total Trips"
            value={dashboardData.totalTrips}
            subtitle="Completed today"
            icon={Route}
            trend={dashboardData.totalTrips > 0 ? "up" : "neutral"}
            trendValue={dashboardData.totalTrips > 0 ? "Active routes" : "No trips yet"}
            animate={true}
          />
          <MetricCard
            title="Avg Delivery Time"
            value={`${dashboardData.averageDeliveryTime} min`}
            subtitle="Route optimization"
            icon={Clock}
            trend={dashboardData.averageDeliveryTime > 0 ? "neutral" : "neutral"}
            trendValue={dashboardData.averageDeliveryTime > 0 ? "Tracking" : "No deliveries"}
            animate={true}
          />
          <MetricCard
            title="Cost Savings"
            value={`€${dashboardData.costSavings.toLocaleString()}`}
            subtitle="AI optimization"
            icon={TrendingUp}
            trend={dashboardData.costSavings > 0 ? "up" : "neutral"}
            trendValue={dashboardData.costSavings > 0 ? "Optimizing" : "Deploy AI agents"}
            animate={true}
          />
        </motion.div>

        {/* Fleet Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Active Operations */}
          <div className="terminal-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light text-white matrix-text">Active Operations</h3>
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.totalTrips === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No active operations</p>
                  <p className="text-sm text-gray-500">Start by adding vehicles to your fleet</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* AI Agent Status */}
          <div className="terminal-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light text-white matrix-text">AI Agent Status</h3>
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.aiAgentsOnline === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No AI agents active</p>
                  <p className="text-sm text-gray-500">Deploy agents to start automation</p>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
