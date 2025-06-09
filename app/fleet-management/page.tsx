
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Users, 
  Route, 
  MapPin, 
  Fuel, 
  AlertTriangle, 
  Activity,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Fleet {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status: string;
  vehicles?: any[];
  drivers?: any[];
  routes?: any[];
  createdAt: Date;
  updatedAt: Date;
}

interface LiveMetrics {
  activeVehicles: number;
  ongoingTrips: number;
  fuelEfficiency: number;
  averageSpeed: number;
  alertsCount: number;
  complianceStatus: number;
}

export default function FleetManagementPage() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    activeVehicles: 0,
    ongoingTrips: 0,
    fuelEfficiency: 0,
    averageSpeed: 0,
    alertsCount: 0,
    complianceStatus: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);

  useEffect(() => {
    fetchFleets();
    fetchLiveMetrics();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchLiveMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchFleets = async () => {
    try {
      const response = await fetch('/api/fleet-management?include=vehicles,drivers,routes');
      const data = await response.json();
      
      if (data.success) {
        setFleets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch fleets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveMetrics = async () => {
    try {
      const response = await fetch('/api/real-time?type=metrics');
      const data = await response.json();
      
      if (data.success && data.data.liveMetrics) {
        setLiveMetrics(data.data.liveMetrics);
      }
    } catch (error) {
      console.error('Failed to fetch live metrics:', error);
    }
  };

  const createFleet = async () => {
    const name = prompt('Enter fleet name:');
    if (!name) return;

    try {
      const response = await fetch('/api/fleet-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: `Fleet created on ${new Date().toLocaleDateString()}`,
          ownerId: 'user-001' // In real app, get from auth
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchFleets();
      }
    } catch (error) {
      console.error('Failed to create fleet:', error);
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
              {trend}% from last hour
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const FleetCard = ({ fleet }: { fleet: Fleet }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{fleet.name}</CardTitle>
            <Badge variant={fleet.status === 'active' ? 'default' : 'secondary'}>
              {fleet.status}
            </Badge>
          </div>
          <CardDescription>{fleet.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {fleet.vehicles?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {fleet.drivers?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {fleet.routes?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Routes</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => setSelectedFleet(fleet.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage your modern fleet with real-time insights and AI-powered optimization
          </p>
        </div>
        <Button onClick={createFleet} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Fleet
        </Button>
      </motion.div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={Truck}
          title="Active Vehicles"
          value={liveMetrics.activeVehicles}
          color="text-blue-600"
          trend={2.5}
        />
        <MetricCard
          icon={Activity}
          title="Ongoing Trips"
          value={liveMetrics.ongoingTrips}
          color="text-green-600"
          trend={1.8}
        />
        <MetricCard
          icon={Fuel}
          title="Fuel Efficiency"
          value={liveMetrics.fuelEfficiency.toFixed(1)}
          unit="L/100km"
          color="text-orange-600"
          trend={-3.2}
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg Speed"
          value={liveMetrics.averageSpeed}
          unit="km/h"
          color="text-purple-600"
          trend={0.5}
        />
        <MetricCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={liveMetrics.alertsCount}
          color="text-red-600"
        />
        <MetricCard
          icon={Clock}
          title="Compliance"
          value={liveMetrics.complianceStatus}
          unit="%"
          color="text-emerald-600"
          trend={0.2}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="fleets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fleets">Fleets Overview</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="fleets" className="space-y-6">
          {fleets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No fleets found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first fleet to start managing vehicles and drivers
              </p>
              <Button onClick={createFleet}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Fleet
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleets.map((fleet) => (
                <FleetCard key={fleet.id} fleet={fleet} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle Management
              </CardTitle>
              <CardDescription>
                Monitor and manage all vehicles across your fleets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Vehicle management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Driver Management
              </CardTitle>
              <CardDescription>
                Manage driver assignments, compliance, and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Driver management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Route Management
              </CardTitle>
              <CardDescription>
                Plan, optimize, and monitor routes with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Route management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">System Status</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>GPS Tracking: Online</div>
          <div>API Integrations: {Math.floor(Math.random() * 3) + 8}/10 Active</div>
          <div>Last Update: {new Date().toLocaleTimeString()}</div>
        </div>
      </motion.div>
    </div>
  );
}
