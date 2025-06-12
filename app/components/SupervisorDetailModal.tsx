'use client';

import { useState, useEffect } from 'react';
import { X, Activity, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface SupervisorDetailModalProps {
  supervisorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SupervisorDetailModal({ supervisorId, isOpen, onClose }: SupervisorDetailModalProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && supervisorId) {
      loadDashboardData();
    }
  }, [isOpen, supervisorId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/supervisors/${supervisorId}/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold">
              {dashboardData?.supervisor?.name || 'Supervisor Dashboard'}
            </h2>
            <p className="text-blue-100">
              Real-time Performance & Operations Monitor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : dashboardData ? (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Performance Overview */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Performance Score</p>
                      <p className="text-2xl font-bold text-green-700">
                        {dashboardData.performance?.current_score}%
                      </p>
                      <p className="text-green-500 text-xs">
                        {dashboardData.performance?.trend} vs yesterday
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Revenue Today</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {dashboardData.business?.revenue_today}
                      </p>
                      <p className="text-blue-500 text-xs">
                        Total: {dashboardData.business?.revenue_generated}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Active Agents</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {dashboardData.agents?.active_now}/{dashboardData.agents?.total_managed}
                      </p>
                      <p className="text-purple-500 text-xs">
                        {dashboardData.agents?.coordination_sessions} sessions
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Uptime</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {dashboardData.performance?.uptime}
                      </p>
                      <p className="text-orange-500 text-xs">
                        {dashboardData.performance?.response_time} avg response
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Operations */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Real-time Operations
                </h3>
                <div className="space-y-4">
                  {dashboardData.realtime?.current_operations?.map((op: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium capitalize">
                            {op.type?.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {op.vehicle || op.order || op.customer}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          op.status === 'completed' ? 'bg-green-100 text-green-700' :
                          op.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {op.status?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {op.progress && (
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{op.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${op.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600">
                        {op.estimated_completion && `ETA: ${op.estimated_completion}`}
                        {op.result && op.result}
                        {op.savings_projected && `Projected savings: ${op.savings_projected}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Alerts & Notifications
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-2xl font-bold text-red-600">
                      {dashboardData.alerts?.critical || 0}
                    </div>
                    <div className="text-xs text-red-600">Critical</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="text-2xl font-bold text-yellow-600">
                      {dashboardData.alerts?.warning || 0}
                    </div>
                    <div className="text-xs text-yellow-600">Warning</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.alerts?.info || 0}
                    </div>
                    <div className="text-xs text-blue-600">Info</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashboardData.alerts?.recent_alerts?.slice(0, 5).map((alert: any, index: number) => (
                    <div key={index} className="border-l-4 border-l-yellow-400 bg-yellow-50 p-3 rounded-r">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Action: {alert.action_taken}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Coordination */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Agent Coordination Status
                </h3>
                <div className="grid gap-4">
                  {dashboardData.agents?.agents_list?.map((agent: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-gray-600">
                            Performance: {agent.performance}% | Success: {agent.success_rate}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Tasks: {agent.tasks_assigned} | Last: {agent.last_coordination}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            agent.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium">
                            {agent.performance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations
                </h3>
                <div className="space-y-4">
                  {dashboardData.recommendations?.slice(0, 3).map((rec: any, index: number) => (
                    <div key={index} className={`border-l-4 p-3 rounded-r ${
                      rec.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                      rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600 font-medium">
                          Impact: {rec.estimated_impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="lg:col-span-3">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
                <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">📊 Performance Chart Visualization</p>
                  <p className="text-sm text-gray-500 ml-2">
                    (Efficiency: {dashboardData.performance?.optimization_rate}% | 
                    Coordination: {dashboardData.performance?.coordination_efficiency}%)
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-600">Failed to load dashboard data</p>
          </div>
        )}
      </div>
    </div>
  );
} 