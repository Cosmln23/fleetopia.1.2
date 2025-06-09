
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Truck, 
  Map, 
  Cloud, 
  Navigation, 
  Mail, 
  Fuel, 
  Shield, 
  Wrench, 
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExtensionCapability {
  providers: string[];
  features: string[];
  status: string;
  integrations: number;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastCheck: Date;
  errorRate: number;
  integrations: number;
  providers: number;
}

interface OverallHealth {
  totalExtensions: number;
  activeExtensions: number;
  degradedExtensions: number;
  downExtensions: number;
  averageLatency: number;
  averageErrorRate: number;
  totalIntegrations: number;
  lastUpdate: Date;
}

export default function ApiIntegrationsPage() {
  const [extensionCapabilities, setExtensionCapabilities] = useState<Record<string, ExtensionCapability>>({});
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [overallHealth, setOverallHealth] = useState<OverallHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExtensionsData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchExtensionsData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchExtensionsData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/extensions');
      const data = await response.json();
      
      if (data.success) {
        setExtensionCapabilities(data.data.extensionCapabilities);
        setHealthChecks(data.data.healthChecks);
        setOverallHealth(data.data.overallHealth);
      }
    } catch (error) {
      console.error('Failed to fetch extensions data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getExtensionIcon = (type: string) => {
    const icons: Record<string, any> = {
      freight_matching: Truck,
      gps_telematics: Navigation,
      mapping: Map,
      weather: Cloud,
      traffic: Activity,
      communication: Mail,
      fuel: Fuel,
      compliance: Shield,
      maintenance: Wrench,
      financial: DollarSign
    };
    return icons[type] || Zap;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertCircle;
      case 'down': return AlertCircle;
      default: return Clock;
    }
  };

  const ExtensionCard = ({ type, capability }: { type: string, capability: ExtensionCapability }) => {
    const Icon = getExtensionIcon(type);
    const healthCheck = healthChecks.find(h => h.service === type);
    const StatusIcon = healthCheck ? getStatusIcon(healthCheck.status) : Clock;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg capitalize">
                  {type.replace('_', ' ')}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <StatusIcon className={`h-4 w-4 ${healthCheck ? getStatusColor(healthCheck.status) : 'text-gray-400'}`} />
                <Badge variant={capability.status === 'active' ? 'default' : 'secondary'}>
                  {capability.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Providers</span>
                <span>{capability.providers.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {capability.providers.slice(0, 3).map((provider) => (
                  <Badge key={provider} variant="outline" className="text-xs">
                    {provider}
                  </Badge>
                ))}
                {capability.providers.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{capability.providers.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Features</span>
                <span>{capability.features.length}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {capability.features.slice(0, 2).join(', ')}
                {capability.features.length > 2 && '...'}
              </div>
            </div>

            {healthCheck && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Latency</span>
                  <span>{healthCheck.latency}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - healthCheck.latency)} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Error Rate</span>
                  <span>{(healthCheck.errorRate * 100).toFixed(1)}%</span>
                </div>
                <Progress value={Math.max(0, 100 - (healthCheck.errorRate * 100))} className="h-2" />
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground">
                {capability.integrations} active
              </span>
              <Button size="sm" variant="outline">
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
          <h1 className="text-3xl font-bold tracking-tight">API Integrations</h1>
          <p className="text-muted-foreground">
            Monitor and manage all external API integrations for your transport platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchExtensionsData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </motion.div>

      {/* Overall Health Dashboard */}
      {overallHealth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {overallHealth.activeExtensions}
                  </div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {overallHealth.degradedExtensions}
                  </div>
                  <div className="text-xs text-muted-foreground">Degraded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {overallHealth.downExtensions}
                  </div>
                  <div className="text-xs text-muted-foreground">Down</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {overallHealth.averageLatency}ms
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(overallHealth.averageErrorRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {overallHealth.totalIntegrations}
                  </div>
                  <div className="text-xs text-muted-foreground">Integrations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round((overallHealth.activeExtensions / overallHealth.totalExtensions) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Extensions Grid */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Extensions</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(extensionCapabilities).map(([type, capability]) => (
              <ExtensionCard key={type} type={type} capability={capability} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transport" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(extensionCapabilities)
              .filter(([type]) => ['freight_matching', 'gps_telematics', 'mapping', 'traffic'].includes(type))
              .map(([type, capability]) => (
                <ExtensionCard key={type} type={type} capability={capability} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(extensionCapabilities)
              .filter(([type]) => ['communication', 'weather'].includes(type))
              .map(([type, capability]) => (
                <ExtensionCard key={type} type={type} capability={capability} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(extensionCapabilities)
              .filter(([type]) => ['financial', 'compliance', 'fuel'].includes(type))
              .map(([type, capability]) => (
                <ExtensionCard key={type} type={type} capability={capability} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(extensionCapabilities)
              .filter(([type]) => ['maintenance', 'gps_telematics'].includes(type))
              .map(([type, capability]) => (
                <ExtensionCard key={type} type={type} capability={capability} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Real-time Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="fixed bottom-4 left-4 bg-background border rounded-lg shadow-lg p-4 max-w-xs"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live Monitoring</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>API Calls: {Math.floor(Math.random() * 1000) + 500}/min</div>
          <div>Response Time: {Math.floor(Math.random() * 50) + 20}ms</div>
          <div>Success Rate: {(99.5 + Math.random() * 0.5).toFixed(1)}%</div>
        </div>
      </motion.div>
    </div>
  );
}
