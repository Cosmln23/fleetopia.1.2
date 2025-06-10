'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Plus,
  Eye,
  Trash2,
  TestTube,
  Globe,
  Clock,
  Shield,
  Activity,
  Database,
  Cloud,
  Smartphone
} from 'lucide-react';
import { APIIntegrationForm } from '@/components/api-integration-form';
import { AgentAPIConnector } from '@/components/agent-api-connector';

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: 'REST' | 'GraphQL' | 'WebSocket' | 'SOAP';
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  health: number;
  endpoint: string;
  lastTested: string;
  requestsToday: number;
  responseTime: number;
  connectedAgents: number;
  category: string;
  requiresAuth: boolean;
}

export default function APIIntegrationsPage() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([
    {
      id: '1',
      name: 'Google Maps API',
      description: 'Real-time mapping and routing services',
      provider: 'Google',
      type: 'REST',
      status: 'connected',
      health: 98,
      endpoint: 'https://maps.googleapis.com/maps/api/',
      lastTested: '2 minutes ago',
      requestsToday: 1547,
      responseTime: 120,
      connectedAgents: 3,
      category: 'Navigation',
      requiresAuth: true
    },
    {
      id: '2',
      name: 'Weather Service API',
      description: 'Weather data and forecasting',
      provider: 'OpenWeather',
      type: 'REST',
      status: 'connected',
      health: 95,
      endpoint: 'https://api.openweathermap.org/data/',
      lastTested: '5 minutes ago',
      requestsToday: 234,
      responseTime: 89,
      connectedAgents: 2,
      category: 'Weather',
      requiresAuth: true
    },
    {
      id: '3',
      name: 'Fuel Price API',
      description: 'Real-time fuel pricing data',
      provider: 'FuelPrices.io',
      type: 'REST',
      status: 'connected',
      health: 92,
      endpoint: 'https://api.fuelprices.io/v1/',
      lastTested: '1 hour ago',
      requestsToday: 89,
      responseTime: 156,
      connectedAgents: 1,
      category: 'Pricing',
      requiresAuth: true
    },
    {
      id: '4',
      name: 'Payment Gateway',
      description: 'Secure payment processing',
      provider: 'Stripe',
      type: 'REST',
      status: 'error',
      health: 45,
      endpoint: 'https://api.stripe.com/v1/',
      lastTested: '3 hours ago',
      requestsToday: 12,
      responseTime: 2340,
      connectedAgents: 0,
      category: 'Payment',
      requiresAuth: true
    },
    {
      id: '5',
      name: 'SMS Gateway',
      description: 'Customer notification service',
      provider: 'Twilio',
      type: 'REST',
      status: 'disconnected',
      health: 0,
      endpoint: 'https://api.twilio.com/2010-04-01/',
      lastTested: 'Never',
      requestsToday: 0,
      responseTime: 0,
      connectedAgents: 0,
      category: 'Communication',
      requiresAuth: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 border-green-400';
      case 'disconnected': return 'text-gray-400 border-gray-400';
      case 'error': return 'text-red-400 border-red-400';
      case 'testing': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation': return <Globe className="w-5 h-5" />;
      case 'Weather': return <Cloud className="w-5 h-5" />;
      case 'Pricing': return <Database className="w-5 h-5" />;
      case 'Payment': return <Shield className="w-5 h-5" />;
      case 'Communication': return <Smartphone className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const totalIntegrations = integrations.length;
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalRequests = integrations.reduce((sum, i) => sum + i.requestsToday, 0);
  const avgHealth = integrations.reduce((sum, i) => sum + i.health, 0) / integrations.length;

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
                API Integrations
              </h1>
              <p className="text-slate-400 text-lg">
                Connect your APIs and let clients bring their own services
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <LinkIcon className="w-4 h-4 mr-2" />
                {connectedIntegrations}/{totalIntegrations} Connected
              </Badge>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
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
                  <p className="text-sm text-slate-400">Total APIs</p>
                  <p className="text-2xl font-bold text-white">{totalIntegrations}</p>
                  <p className="text-xs text-blue-400">5 categories</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Connected</p>
                  <p className="text-2xl font-bold text-green-400">{connectedIntegrations}</p>
                  <p className="text-xs text-green-400">{((connectedIntegrations / totalIntegrations) * 100).toFixed(0)}% uptime</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Requests Today</p>
                  <p className="text-2xl font-bold text-purple-400">{totalRequests.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+12% from yesterday</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Health</p>
                  <p className="text-2xl font-bold text-yellow-400">{avgHealth.toFixed(0)}%</p>
                  <p className="text-xs text-green-400">All systems operational</p>
                </div>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">API Overview</TabsTrigger>
              <TabsTrigger value="connections">Agent Connections</TabsTrigger>
              <TabsTrigger value="testing">API Testing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* API List */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Connected APIs</CardTitle>
                      <CardDescription>Manage your external API integrations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {integrations.map((api) => (
                        <motion.div
                          key={api.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 bg-slate-700/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-slate-600 rounded-lg">
                                {getCategoryIcon(api.category)}
                              </div>
                              <div>
                                <p className="font-medium text-white">{api.name}</p>
                                <p className="text-sm text-slate-400">{api.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(api.status)}`}>
                                {getStatusIcon(api.status)}
                                <span className="ml-1 capitalize">{api.status}</span>
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Health</p>
                              <div className="flex items-center space-x-2">
                                <Progress value={api.health} className="h-2 flex-1" />
                                <span className="text-white font-medium">{api.health}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-400">Requests Today</p>
                              <p className="text-white font-medium">{api.requestsToday.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Response Time</p>
                              <p className="text-white font-medium">{api.responseTime}ms</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Connected Agents</p>
                              <p className="text-white font-medium">{api.connectedAgents}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                            <span>{api.provider} • {api.type}</span>
                            <span>Last tested: {api.lastTested}</span>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start"
                        onClick={() => setShowAddForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New API
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setShowConnector(true)}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect to Agent
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TestTube className="w-4 h-4 mr-2" />
                        Test All APIs
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-200">
                        <Activity className="w-5 h-5 mr-2 text-blue-400" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">API Gateway</span>
                        <span className="text-green-400 font-bold">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Load Balancer</span>
                        <span className="text-green-400 font-bold">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Rate Limiting</span>
                        <span className="text-blue-400 font-bold">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Security</span>
                        <span className="text-green-400 font-bold">Secured</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-200">Agent-API Connections</CardTitle>
                  <CardDescription>Connect AI agents with your APIs for seamless integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <LinkIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Agent Connection Hub</h3>
                    <p className="text-slate-400 mb-6">
                      Connect your AI agents with APIs to enable intelligent automation
                    </p>
                    <Button onClick={() => setShowConnector(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testing Tab */}
            <TabsContent value="testing">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">API Testing Suite</CardTitle>
                    <CardDescription>Test API endpoints and monitor performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {integrations.filter(api => api.status === 'connected').map((api) => (
                        <div key={api.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(api.category)}
                            <span className="text-white">{api.name}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TestTube className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                      <p className="text-slate-400">Run API tests to see results here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Usage Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">{totalRequests.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">Total Requests</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">{connectedIntegrations}</p>
                        <p className="text-sm text-slate-400">Active APIs</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">142ms</p>
                        <p className="text-sm text-slate-400">Avg Response</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">99.2%</p>
                        <p className="text-sm text-slate-400">Uptime</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">System Load</span>
                      <span className="text-green-400 font-bold">23%</span>
                    </div>
                    <Progress value={23} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Error Rate</span>
                      <span className="text-green-400 font-bold">0.8%</span>
                    </div>
                    <Progress value={0.8} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Throughput</span>
                      <span className="text-blue-400 font-bold">1.2K req/min</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Add API Form Modal */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add New API Integration</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    <span>✕</span>
                  </Button>
                </div>
                <APIIntegrationForm
                  onSubmit={(data) => {
                    console.log('New API integration:', data);
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Agent Connector Modal */}
        {showConnector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Connect Agent to API</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowConnector(false)}
                  >
                    <span>✕</span>
                  </Button>
                </div>
                <AgentAPIConnector
                  onConnect={(data) => {
                    console.log('Agent connected to API:', data);
                    setShowConnector(false);
                  }}
                  onCancel={() => setShowConnector(false)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
