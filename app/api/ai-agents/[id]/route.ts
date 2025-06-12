import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Mock agent data for now - in production this would come from database
    const mockAgents = [
      {
        id: 'route-optimizer-pro',
        name: 'RouteOptimizer Pro',
        description: 'AI-powered route optimization with ML learning',
        longDescription: 'Advanced route optimization system that uses machine learning to continuously improve delivery routes. Features real-time traffic analysis, weather optimization, and predictive analytics to reduce fuel consumption by up to 45%.',
        price: 89,
        rating: 4.9,
        downloads: 12847,
        version: '3.0.0',
        category: 'Route Optimization',
        status: 'active',
        features: [
          'ML route planning',
          'Neural predictions', 
          'Real-time learning',
          'Traffic analysis',
          'Weather optimization',
          'Fuel optimization',
          'Driver behavior analysis',
          'Cost reduction tracking'
        ],
        requirements: ['Google Maps API', 'Traffic Data'],
        requiresAPI: ['Google Maps', 'Traffic Data', 'Weather API'],
        systemRequirements: ['Node.js 18+', 'Redis', 'PostgreSQL', 'TensorFlow'],
        performanceScore: 95.2,
        avgResponseTime: 125,
        successRate: 92,
        uptime: 99.8,
        enhancedFeatures: {
          mlOptimization: true,
          neuralPredictions: true,
          realTimeLearning: true
        }
      },
      {
        id: 'fuel-master-ai',
        name: 'FuelMaster AI',
        description: 'Complete fuel optimization ecosystem with 3 advanced AI engines',
        longDescription: 'Comprehensive fuel management solution featuring Predictive Fuel Consumption AI, Dynamic Fuel Pricing Optimizer, and Micro-Optimization Fuel Engine. Delivers real-time cost optimization and 7-day fuel forecasting.',
        price: 89,
        rating: 4.8,
        downloads: 8934,
        version: '2.1.0',
        category: 'Fuel Management',
        status: 'active',
        features: [
          'Micro-Optimization Fuel Engine',
          'Real-time driving coaching',
          '7-day fuel forecasting',
          'Market trend analysis',
          'Cost optimization',
          'Dynamic pricing',
          'Fuel consumption prediction',
          'Driver behavior analytics'
        ],
        requirements: ['Fuel Price API', 'Vehicle Diagnostics'],
        requiresAPI: ['Fuel Price API', 'Vehicle Diagnostics', 'IoT Sensors'],
        systemRequirements: ['Node.js 18+', 'MongoDB', 'Redis', 'Machine Learning APIs'],
        performanceScore: 88.9,
        avgResponseTime: 145,
        successRate: 88,
        uptime: 99.5,
        enhancedFeatures: {
          fuelPrediction: true,
          dynamicPricing: true,
          microOptimization: true
        }
      },
      {
        id: 'delivery-predictor',
        name: 'DeliveryPredictor',
        description: 'ML-powered delivery time predictions and scheduling',
        longDescription: 'Advanced delivery prediction system using machine learning algorithms to provide accurate delivery time estimates, optimize scheduling, and enhance customer satisfaction through smart notifications.',
        price: 29,
        rating: 4.7,
        downloads: 15623,
        version: '1.5.2',
        category: 'Delivery Management',
        status: 'active',
        features: [
          'Time prediction',
          'Smart scheduling',
          'Customer notifications',
          'Route optimization',
          'Real-time tracking',
          'Delivery analytics',
          'Performance monitoring',
          'API integration'
        ],
        requirements: ['Weather API', 'Calendar Integration'],
        requiresAPI: ['Weather API', 'Calendar Integration', 'SMS Service'],
        systemRequirements: ['Node.js 16+', 'PostgreSQL', 'Redis'],
        performanceScore: 88.9,
        avgResponseTime: 98,
        successRate: 87,
        uptime: 99.2,
        enhancedFeatures: {
          timePrediction: true,
          smartScheduling: true,
          customerNotifications: true
        }
      }
    ];

    // Find agent by ID
    const agent = mockAgents.find(a => a.id === agentId);
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Return detailed agent information
    return NextResponse.json(agent);

  } catch (error) {
    console.error('Error fetching agent details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 