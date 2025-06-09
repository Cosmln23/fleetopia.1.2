
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Shield, Activity, TrendingUp, Users, DollarSign, Clock,
  CheckCircle, AlertCircle, Play, Pause, Settings, BarChart3,
  Target, Zap, Package, FileCheck, Calculator, Wrench, CloudRain
} from 'lucide-react';
import MetricCard from '@/components/metric-card';

interface SupervisorAgent {
  id: string;
  name: string;
  type: string;
  category: string;
  supervisorType: string;
  status: string;
  performance: number;
  revenue: number;
  revenueGenerated: number;
  performanceScore: number;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  description: string;
  version: string;
  capabilities: string[];
  isActive: boolean;
  analytics?: {
    subordinateCount: number;
    totalRevenue: number;
    avgPerformance: number;
    activeTasks: number;
    completedTasks: number;
    efficiency: number;
  };
}

interface SupervisorTask {
  id: string;
  supervisorId: string;
  taskType: string;
  priority: string;
  status: string;
  description: string;
  result?: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  supervisor: {
    id: string;
    name: string;
    type: string;
    supervisorType: string;
  };
}

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<SupervisorAgent[]>([]);
  const [tasks, setTasks] = useState<SupervisorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorAgent | null>(null);

  useEffect(() => {
    fetchSupervisors();
    fetchTasks();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/supervisors?includeAnalytics=true');
      const data = await response.json();
      setSupervisors(data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/supervisors/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getSupervisorIcon = (supervisorType: string) => {
    return supervisorType === 'logistics' ? <Crown className="w-6 h-6" /> : <Shield className="w-6 h-6" />;
  };

  const totalRevenue = supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.totalRevenue || 0), 0);
  const totalSubordinates = supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.subordinateCount || 0), 0);
  const avgEfficiency = supervisors.length > 0 
    ? supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.efficiency || 0), 0) / supervisors.length
    : 0;
  const activeTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-xl font-thin">Initializing Supervisor Dashboard...</p>
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
            Supervisor <span className="text-purple-400">Command Center</span>
          </h1>
          <p className="text-gray-400 font-light">
            Monitor and coordinate AI supervisor agents managing your fleet operations
          </p>
        </motion.div>

        {/* Supervisor Overview Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Active Supervisors"
            value={supervisors.filter(s => s.status === 'active').length}
            subtitle={`${supervisors.length} total supervisors`}
            icon={Crown}
            trend="neutral"
            animate={true}
          />
          <MetricCard
            title="Managed Agents"
            value={totalSubordinates}
            subtitle="Under supervision"
            icon={Users}
            trend="up"
            trendValue="+3"
            animate={true}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Generated by supervised agents"
            icon={DollarSign}
            trend="up"
            trendValue="+22.1%"
            animate={true}
          />
          <MetricCard
            title="Avg Efficiency"
            value={`${avgEfficiency.toFixed(1)}%`}
            subtitle="Supervisor performance"
            icon={TrendingUp}
            trend="up"
            trendValue="+4.2%"
            animate={true}
          />
        </motion.div>

        {/* Supervisors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {supervisors.map((supervisor, index) => (
            <motion.div
              key={supervisor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="terminal-border rounded-lg p-6 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedSupervisor(supervisor)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-400/10 rounded-lg">
                    {getSupervisorIcon(supervisor.supervisorType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white matrix-text">{supervisor.name}</h3>
                    <p className="text-sm text-gray-400">v{supervisor.version} • {supervisor.supervisorType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded-full text-xs text-purple-400 bg-purple-400/20">
                    supervisor
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(supervisor.status)}`}>
                    <Activity className="w-3 h-3" />
                    <span className="capitalize">{supervisor.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 font-light leading-relaxed">
                {supervisor.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {supervisor.capabilities.slice(0, 4).map((capability, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-400/10 text-purple-400 text-xs rounded">
                    {capability}
                  </span>
                ))}
                {supervisor.capabilities.length > 4 && (
                  <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                    +{supervisor.capabilities.length - 4} more
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    {supervisor.performanceScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    ${supervisor.revenueGenerated.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    {supervisor.analytics?.subordinateCount || 0}
                  </div>
                  <div className="text-xs text-gray-400">Agents</div>
                </div>
              </div>

              {supervisor.analytics && (
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-purple-400">{supervisor.analytics.activeTasks}</div>
                    <div className="text-xs text-gray-400">Active Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">{supervisor.analytics.efficiency.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Efficiency</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button className="px-4 py-2 rounded-lg text-sm font-light transition-all duration-300 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Analytics
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-white matrix-text">Recent Supervisor Tasks</h2>
            <span className="text-sm text-gray-400">{activeTasks} active tasks</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.slice(0, 6).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="terminal-border rounded-lg p-4 hover:border-green-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      {task.supervisor.supervisorType === 'logistics' ? 
                        <Crown className="w-5 h-5 text-purple-400" /> : 
                        <Shield className="w-5 h-5 text-purple-400" />
                      }
                    </div>
                    <div>
                      <h3 className="text-white font-light">{task.description}</h3>
                      <p className="text-sm text-gray-400">
                        {task.supervisor.name} • {task.taskType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : 
                       task.status === 'in_progress' ? <Activity className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                {task.result && (
                  <div className="mt-3 p-3 bg-green-400/5 rounded-lg border border-green-400/20">
                    <p className="text-sm text-green-400">
                      Result: {typeof task.result === 'object' ? JSON.stringify(task.result) : task.result}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Supervisor Details Modal */}
        {selectedSupervisor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSupervisor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="terminal-border rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-400/10 rounded-lg">
                    {getSupervisorIcon(selectedSupervisor.supervisorType)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white matrix-text">{selectedSupervisor.name}</h2>
                    <p className="text-gray-400">v{selectedSupervisor.version} • {selectedSupervisor.supervisorType} supervisor</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupervisor(null)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Description</h3>
                    <p className="text-gray-300 font-light leading-relaxed">{selectedSupervisor.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupervisor.capabilities.map((capability, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-400/10 text-purple-400 text-sm rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Recent Tasks</h3>
                    <div className="space-y-2">
                      {tasks.filter(task => task.supervisorId === selectedSupervisor.id).slice(0, 3).map((task, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">{task.description}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getTaskStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Performance Analytics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Performance Score:</span>
                        <span className="text-white">{selectedSupervisor.performanceScore.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white">{selectedSupervisor.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Response Time:</span>
                        <span className="text-white">{selectedSupervisor.avgResponseTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Generated:</span>
                        <span className="text-white">${selectedSupervisor.revenueGenerated.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSupervisor.analytics && (
                    <div>
                      <h3 className="text-lg font-light text-purple-400 mb-2">Supervision Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Managed Agents:</span>
                          <span className="text-white">{selectedSupervisor.analytics.subordinateCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active Tasks:</span>
                          <span className="text-white">{selectedSupervisor.analytics.activeTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed Tasks:</span>
                          <span className="text-white">{selectedSupervisor.analytics.completedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Efficiency:</span>
                          <span className="text-white">{selectedSupervisor.analytics.efficiency.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">System Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`capitalize ${
                          selectedSupervisor.status === 'active' ? 'text-green-400' :
                          selectedSupervisor.status === 'maintenance' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {selectedSupervisor.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedSupervisor.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Supervisor ID:</span>
                        <span className="text-white font-mono">{selectedSupervisor.id}</span>
                      </div>
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
