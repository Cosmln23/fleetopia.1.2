'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Fuel, 
  Clock, 
  Route,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Settings,
  Eye,
  Zap,
  User,
  Minus,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
// import { FleetMap } from '@/components/fleet-map'; // TODO: Create fleet map component

interface Vehicle {
  id: string;
  license: string;
  driver: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  route: {
    origin: string;
    destination: string;
    progress: number;
    eta: string;
  };
  fuel: {
    level: number;
    efficiency: number;
    cost: number;
  };
  performance: {
    speed: number;
    distance: number;
    duration: string;
  };
}

interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  availableDrivers: number;
  totalRoutes: number;
  completedToday: number;
  fuelEfficiency: number;
  onTimeDelivery: number;
}

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fleetStats, setFleetStats] = useState<FleetStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    availableDrivers: 0,
    totalRoutes: 0,
    completedToday: 0,
    fuelEfficiency: 0,
    onTimeDelivery: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  useEffect(() => {
    fetchFleetData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchFleetData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real fleet data from API
      const [vehiclesResponse, statsResponse] = await Promise.all([
        fetch('/api/fleet-management/vehicles'),
        fetch('/api/fleet-management/stats')
      ]);

      if (!vehiclesResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch fleet data');
      }

      const vehiclesData = await vehiclesResponse.json();
      const statsData = await statsResponse.json();

      // Transform real data to component format
      const realVehicles: Vehicle[] = vehiclesData.data?.map((vehicle: any) => ({
        id: vehicle.id,
        license: vehicle.licensePlate || 'N/A',
        driver: vehicle.currentDriver?.name || 'Unassigned',
        status: vehicle.status || 'offline',
        location: {
          lat: vehicle.lastLocation?.latitude || 0,
          lng: vehicle.lastLocation?.longitude || 0,
          address: vehicle.lastLocation?.address || 'Unknown location'
        },
        route: {
          origin: vehicle.currentRoute?.origin || 'N/A',
          destination: vehicle.currentRoute?.destination || 'N/A',
          progress: vehicle.currentRoute?.progress || 0,
          eta: vehicle.currentRoute?.eta || 'N/A'
        },
        fuel: {
          level: vehicle.fuelLevel || 0,
          efficiency: vehicle.fuelEfficiency || 0,
          cost: vehicle.fuelCost || 0
        },
        performance: {
          speed: vehicle.currentSpeed || 0,
          distance: vehicle.dailyDistance || 0,
          duration: vehicle.drivingDuration || '0h 0m'
        }
      })) || [];

      setVehicles(realVehicles);
      
      // Set real fleet statistics
      setFleetStats({
        totalVehicles: statsData.totalVehicles || 0,
        activeVehicles: statsData.activeVehicles || 0,
        totalDrivers: statsData.totalDrivers || 0,
        availableDrivers: statsData.availableDrivers || 0,
        totalRoutes: statsData.totalRoutes || 0,
        completedToday: statsData.completedToday || 0,
        fuelEfficiency: statsData.fuelEfficiency || 0,
        onTimeDelivery: statsData.onTimeDelivery || 0
      });

    } catch (error) {
      console.error('Error fetching fleet data:', error);
      setError('Failed to load fleet data. Please try again.');
      
      // Keep current data on error, don't reset to empty
      if (vehicles.length === 0) {
        setFleetStats({
          totalVehicles: 0,
          activeVehicles: 0,
          totalDrivers: 0,
          availableDrivers: 0,
          totalRoutes: 0,
          completedToday: 0,
          fuelEfficiency: 0,
          onTimeDelivery: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'idle': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'offline': return <AlertTriangle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  // FleetMap Component
  const FleetMapComponent = ({ vehicles }: { vehicles: Vehicle[] }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return (
        <div className="w-full h-96 bg-slate-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading live map...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-96 bg-slate-900/50 rounded-lg relative overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148, 163, 184)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Center Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>

        {/* Vehicle Markers */}
        {vehicles.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Truck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No vehicles to track</p>
              <p className="text-sm text-slate-500">Add vehicles to see them on the map</p>
            </div>
          </div>
        ) : (
          vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                top: `${25 + (index * 15) % 50}%`,
                left: `${20 + (index * 20) % 60}%`,
              }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${getStatusColor(vehicle.status)}`}>
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-slate-800 px-2 py-1 rounded">
                {vehicle.license}
              </div>
            </div>
          ))
        )}

        {/* Map Notice */}
        <div className="absolute top-4 left-4 bg-blue-600/80 rounded-lg p-2 text-xs text-white">
          🗺️ Demo Map - Connect Google Maps API for real tracking
        </div>
      </div>
    );
  };

  // Empty state component
  const EmptyState = ({ title, description, action }: { title: string; description: string; action?: () => void }) => (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-8 text-center">
        <Truck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-4">{description}</p>
        {action && (
          <Button onClick={action} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add First Vehicle
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
            <p className="text-slate-400">Real-time tracking and optimization of your entire fleet</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}
            <Button 
              onClick={fetchFleetData} 
              disabled={loading}
              variant="outline" 
              size="sm"
              className="border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setShowMap(!showMap)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showMap ? 'Hide' : 'Live'} Map View
            </Button>
          </div>
        </motion.div>

        {/* Fleet Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Vehicles</p>
                  <p className="text-2xl font-bold text-white">{fleetStats.totalVehicles}</p>
                  {fleetStats.totalVehicles === 0 ? (
                    <p className="text-xs text-slate-500">No vehicles registered</p>
                  ) : (
                    <p className="text-xs text-green-400">Active fleet</p>
                  )}
                </div>
                <Truck className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Now</p>
                  <p className="text-2xl font-bold text-green-400">{fleetStats.activeVehicles}</p>
                  {fleetStats.totalVehicles > 0 ? (
                    <p className="text-xs text-blue-400">
                      {((fleetStats.activeVehicles / fleetStats.totalVehicles) * 100).toFixed(1)}% utilization
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">No active vehicles</p>
                  )}
                </div>
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-green-400" />
                  {getTrendIcon(fleetStats.activeVehicles)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {fleetStats.fuelEfficiency > 0 ? `${fleetStats.fuelEfficiency}%` : 'N/A'}
                  </p>
                  {fleetStats.fuelEfficiency > 0 ? (
                    <p className="text-xs text-green-400">Above average</p>
                  ) : (
                    <p className="text-xs text-slate-500">No data available</p>
                  )}
                </div>
                <div className="flex items-center">
                  <Fuel className="w-8 h-8 text-yellow-400" />
                  {getTrendIcon(fleetStats.fuelEfficiency, 85)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {fleetStats.onTimeDelivery > 0 ? `${fleetStats.onTimeDelivery}%` : 'N/A'}
                  </p>
                  {fleetStats.onTimeDelivery > 0 ? (
                    <p className="text-xs text-green-400">Excellent performance</p>
                  ) : (
                    <p className="text-xs text-slate-500">No deliveries yet</p>
                  )}
                </div>
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-400" />
                  {getTrendIcon(fleetStats.onTimeDelivery, 90)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Map View */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Fleet Tracking
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time vehicle locations and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FleetMapComponent vehicles={vehicles} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Vehicle List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Fleet Vehicles</CardTitle>
              <CardDescription className="text-slate-400">
                {vehicles.length === 0 
                  ? "No vehicles in your fleet yet" 
                  : `Managing ${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <EmptyState
                  title="No Vehicles Found"
                  description="Add your first vehicle to start tracking your fleet in real-time."
                  action={() => setShowAddVehicleModal(true)}
                />
              ) : (
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Truck className="w-8 h-8 text-blue-400" />
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-white">{vehicle.license}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <User className="w-4 h-4" />
                              <span>{vehicle.driver}</span>
                              <Badge variant="outline" className="ml-2">
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(vehicle.status)}
                                  <span className="capitalize">{vehicle.status}</span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-right">
                          <div>
                            <p className="text-sm text-slate-400">Location</p>
                            <div className="flex items-center text-white">
                              <MapPin className="w-4 h-4 mr-1 text-red-400" />
                              <span className="text-sm truncate max-w-24">
                                {vehicle.location.address || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-slate-400">Fuel</p>
                            <div className="flex items-center text-white">
                              <Fuel className="w-4 h-4 mr-1 text-yellow-400" />
                              <span>{vehicle.fuel.level}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-slate-400">Route Progress</p>
                            <div className="w-20">
                              <Progress value={vehicle.route.progress} className="h-2" />
                              <span className="text-xs text-white">{vehicle.route.progress}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-slate-400">ETA</p>
                            <p className="text-white">{vehicle.route.eta}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Vehicle Modal */}
        {showAddVehicleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Add New Vehicle</h2>
                <button 
                  onClick={() => setShowAddVehicleModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <AddVehicleForm 
                onSubmit={async (vehicleData) => {
                  try {
                    console.log('Submitting vehicle:', vehicleData);
                    const response = await fetch('/api/fleet-management/vehicles', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(vehicleData)
                    });
                    
                    const result = await response.json();
                    console.log('API response:', result);
                    
                    if (response.ok) {
                      setShowAddVehicleModal(false);
                      fetchFleetData(); // Refresh the list
                      alert('Vehicle added successfully!');
                    } else {
                      alert(`Failed to add vehicle: ${result.error || 'Unknown error'}`);
                    }
                  } catch (error) {
                    console.error('Error adding vehicle:', error);
                    alert('Network error. Please try again.');
                  }
                }}
                onCancel={() => setShowAddVehicleModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add Vehicle Form Component
const AddVehicleForm = ({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: any) => Promise<void>; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    name: '',
    type: 'truck',
    fleetId: 'default', // Default fleet for now
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          License Plate *
        </label>
        <input
          type="text"
          required
          value={formData.licensePlate}
          onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., B123ABC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Vehicle Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Delivery Truck 01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Vehicle Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </>
          )}
        </Button>
        
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
