
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Play, Pause, Settings, TrendingUp, Zap, Activity, AlertCircle,
  Crown, Shield, Cpu, Target, Truck, CloudRain, Wrench, Package, 
  FileCheck, Calculator, Users, DollarSign, Clock
} from 'lucide-react';
import MetricCard from '@/components/metric-card';

interface EnhancedAIAgent {
  id: string;
  name: string;
  type: string;
  category: string;
  supervisorType?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  performance: number;
  revenue: number;
  revenueGenerated: number;
  performanceScore: number;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  description: string;
  version: string;
  capabilities?: string[];
  apiEndpoint?: string;
  supervisorId?: string;
  isActive: boolean;
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<EnhancedAIAgent[]>([]);
  const [supervisors, setSupervisors] = useState<EnhancedAIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<EnhancedAIAgent | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'supervisors' | 'logistics' | 'business'>('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents?includeAnalytics=true');
      const data = await response.json();
      
      const supervisorAgents = data.filter((agent: EnhancedAIAgent) => agent.category === 'supervisor');
      const regularAgents = data.filter((agent: EnhancedAIAgent) => agent.category !== 'supervisor');
      
      setSupervisors(supervisorAgents);
      setAgents(regularAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = (agentId: string) => {
    const updateAgents = (prevAgents: EnhancedAIAgent[]) => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              status: agent.status === 'active' ? 'inactive' : 'active' as any,
              isActive: agent.status !== 'active'
            }
          : agent
      );
    
    setAgents(updateAgents);
    setSupervisors(updateAgents);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'supervisor': return 'text-purple-400 bg-purple-400/20';
      case 'enhanced': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-green-400 bg-green-400/20';
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'logistics-supervisor': return <Crown className="w-6 h-6" />;
      case 'business-supervisor': return <Shield className="w-6 h-6" />;
      case 'fuel-optimizer': return <Zap className="w-6 h-6" />;
      case 'route-genius': return <Target className="w-6 h-6" />;
      case 'weather-prophet': return <CloudRain className="w-6 h-6" />;
      case 'maintenance-predictor': return <Wrench className="w-6 h-6" />;
      case 'cargo-matcher': return <Package className="w-6 h-6" />;
      case 'compliance-guardian': return <FileCheck className="w-6 h-6" />;
      case 'price-negotiator': return <Calculator className="w-6 h-6" />;
      default: return <Cpu className="w-6 h-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'inactive': return <Pause className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Pause className="w-4 h-4" />;
    }
  };

  const allAgents = [...supervisors, ...agents];
  const activeAgents = allAgents.filter(agent => agent.status === 'active');
  const totalRevenue = allAgents.reduce((sum, agent) => sum + (agent.revenueGenerated || agent.revenue), 0);
  const avgPerformance = allAgents.length > 0 
    ? allAgents.reduce((sum, agent) => sum + (agent.performanceScore || agent.performance), 0) / allAgents.length
    : 0;

  const getFilteredAgents = () => {
    switch (activeTab) {
      case 'supervisors':
        return supervisors;
      case 'logistics':
        return agents.filter(agent => agent.supervisorId === supervisors.find(s => s.supervisorType === 'logistics')?.id);
      case 'business':
        return agents.filter(agent => agent.supervisorId === supervisors.find(s => s.supervisorType === 'business')?.id);
      default:
        return allAgents;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-xl font-thin">Initializing AI Agents...</p>
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
            AI Agent <span className="text-green-400">Control Center</span>
          </h1>
          <p className="text-gray-400 font-light">
            Monitor and manage your fleet's artificial intelligence systems and supervisor agents
          </p>
        </motion.div>

        {/* Enhanced Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Active Agents"
            value={activeAgents.length}
            subtitle={`${allAgents.length} total agents`}
            icon={Users}
            trend="neutral"
            animate={true}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Generated by agents"
            icon={DollarSign}
            trend="up"
            trendValue="+18.3%"
            animate={true}
          />
          <MetricCard
            title="Avg Performance"
            value={`${avgPerformance.toFixed(1)}%`}
            subtitle="Agent efficiency"
            icon={TrendingUp}
            trend="up"
            trendValue="+2.4%"
            animate={true}
          />
          <MetricCard
            title="Supervisors"
            value={supervisors.length}
            subtitle={`Managing ${agents.length} agents`}
            icon={Crown}
            trend="neutral"
            animate={true}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg border border-green-500/30">
            {[
              { key: 'all', label: 'All Agents', color: 'green' },
              { key: 'supervisors', label: 'Supervisors', color: 'purple' },
              { key: 'logistics', label: 'Logistics', color: 'blue' },
              { key: 'business', label: 'Business', color: 'orange' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-light transition-all duration-300 ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-500/20 text-${tab.color}-400`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Agent Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
        >
          {getFilteredAgents().map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="terminal-border rounded-lg p-6 hover:border-green-400/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    agent.category === 'supervisor' ? 'bg-purple-400/10' : 'bg-green-400/10'
                  }`}>
                    {getAgentIcon(agent.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white matrix-text">{agent.name}</h3>
                    <p className="text-sm text-gray-400">v{agent.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(agent.category)}`}>
                    {agent.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className="capitalize">{agent.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 font-light leading-relaxed">
                {agent.description}
              </p>

              {agent.capabilities && agent.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.capabilities.slice(0, 3).map((capability, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded">
                      {capability.replace('_', ' ')}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                      +{agent.capabilities.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-light text-green-400">
                    {(agent.performanceScore || agent.performance).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-green-400">
                    ${(agent.revenueGenerated || agent.revenue).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-green-400">
                    {agent.requests?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {agent.category === 'supervisor' ? 'Subordinates' : 'Requests'}
                  </div>
                </div>
              </div>

              {agent.successRate !== undefined && (
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400">{agent.successRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">{agent.avgResponseTime?.toFixed(0) || '0'}ms</div>
                    <div className="text-xs text-gray-400">Avg Response</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAgentStatus(agent.id);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-light transition-all duration-300 ${
                    agent.status === 'active' 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                  }`}
                >
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 inline mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 inline mr-2" />
                      Start
                    </>
                  )}
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Agent Details Modal */}
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="terminal-border rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    selectedAgent.category === 'supervisor' ? 'bg-purple-400/10' : 'bg-green-400/10'
                  }`}>
                    {getAgentIcon(selectedAgent.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white matrix-text">{selectedAgent.name}</h2>
                    <p className="text-gray-400">v{selectedAgent.version} • {selectedAgent.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-green-400 mb-2">Description</h3>
                    <p className="text-gray-300 font-light leading-relaxed">{selectedAgent.description}</p>
                  </div>

                  {selectedAgent.capabilities && selectedAgent.capabilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-light text-green-400 mb-2">Capabilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.capabilities.map((capability, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-400/10 text-green-400 text-sm rounded">
                            {capability.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAgent.apiEndpoint && (
                    <div>
                      <h3 className="text-lg font-light text-green-400 mb-2">API Configuration</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Endpoint:</span>
                          <span className="text-white font-mono">{selectedAgent.apiEndpoint}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-green-400 mb-2">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Performance Score:</span>
                        <span className="text-white">{(selectedAgent.performanceScore || selectedAgent.performance).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Generated:</span>
                        <span className="text-white">${(selectedAgent.revenueGenerated || selectedAgent.revenue).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Requests:</span>
                        <span className="text-white">{selectedAgent.requests?.toLocaleString() || '0'}</span>
                      </div>
                      {selectedAgent.successRate !== undefined && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Success Rate:</span>
                            <span className="text-white">{selectedAgent.successRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Response Time:</span>
                            <span className="text-white">{selectedAgent.avgResponseTime?.toFixed(0) || '0'}ms</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-green-400 mb-2">System Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`capitalize ${
                          selectedAgent.status === 'active' ? 'text-green-400' :
                          selectedAgent.status === 'maintenance' ? 'text-yellow-400' :
                          selectedAgent.status === 'error' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {selectedAgent.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedAgent.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Agent ID:</span>
                        <span className="text-white font-mono">{selectedAgent.id}</span>
                      </div>
                      {selectedAgent.supervisorId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Supervisor:</span>
                          <span className="text-white">
                            {supervisors.find(s => s.id === selectedAgent.supervisorId)?.name || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
