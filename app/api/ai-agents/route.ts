import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// GET - Retrieve AI Agents
export async function GET(request: NextRequest) {
  try {
    // Temporar: disabled auth for testing
    // const session = await getServerSession();
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const marketplace = searchParams.get('marketplace');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (marketplace !== null) {
      where.marketplace = marketplace === 'true';
    }

    const agents = await prisma.aIAgent.findMany({
      where,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        metrics: {
          select: {
            performance: true,
            usage: true,
            timestamp: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // If no agents in database, return mock data for testing
    if (agents.length === 0) {
      const mockAgents = [
        {
          id: "mock-1",
          name: "Route Optimizer Pro",
          description: "Advanced AI for optimal route planning and fuel efficiency",
          version: "2.1.0",
          category: "logistics",
          capabilities: ["routing", "optimization", "fuel_efficiency"],
          configuration: {},
          performance: { accuracy: 95.8, overall: 95.8 },
          successRate: 95.8,
          revenue: 24500,
          requests: 1247,
          avgResponseTime: 120,
          marketplace: true,
          price: 89,
          rating: 4.8,
          downloads: 1247,
          status: "active",
          isActive: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-2",
          name: "Fuel Master AI",
          description: "Smart fuel consumption monitoring and cost optimization",
          version: "1.8.0",
          category: "fuel-management",
          capabilities: ["monitoring", "prediction", "cost_optimization"],
          configuration: {},
          performance: { accuracy: 92.3, overall: 92.3 },
          successRate: 92.3,
          revenue: 18900,
          requests: 892,
          avgResponseTime: 95,
          marketplace: true,
          price: 89,
          rating: 4.6,
          downloads: 892,
          status: "active",
          isActive: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-3",
          name: "Delivery Predictor",
          description: "Predictive analytics for delivery time estimation",
          version: "3.0.0",
          category: "delivery",
          capabilities: ["prediction", "analytics", "time_estimation"],
          configuration: {},
          performance: { accuracy: 89.7, overall: 89.7 },
          successRate: 89.7,
          revenue: 31200,
          requests: 2156,
          avgResponseTime: 85,
          marketplace: true,
          price: 29,
          rating: 4.9,
          downloads: 2156,
          status: "active",
          isActive: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-4",
          name: "FleetGuardian",
          description: "Advanced fleet security and monitoring system",
          version: "1.0.0",
          category: "security",
          capabilities: ["monitoring", "security", "alerts"],
          configuration: {},
          performance: { accuracy: 0, overall: 0 },
          successRate: 0,
          revenue: 0,
          requests: 0,
          avgResponseTime: 0,
          marketplace: true,
          price: 199,
          rating: 0,
          downloads: 0,
          status: "development",
          isActive: false,
          comingSoon: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-5",
          name: "MaintenanceGenie",
          description: "Predictive maintenance and fleet health monitoring",
          version: "1.0.0",
          category: "maintenance",
          capabilities: ["predictive_maintenance", "diagnostics", "scheduling"],
          configuration: {},
          performance: { accuracy: 0, overall: 0 },
          successRate: 0,
          revenue: 0,
          requests: 0,
          avgResponseTime: 0,
          marketplace: true,
          price: 149,
          rating: 0,
          downloads: 0,
          status: "development",
          isActive: false,
          comingSoon: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "mock-6",
          name: "CustomerConnect",
          description: "AI-powered customer communication and support system",
          version: "1.0.0",
          category: "customer-service",
          capabilities: ["communication", "support", "automation"],
          configuration: {},
          performance: { accuracy: 0, overall: 0 },
          successRate: 0,
          revenue: 0,
          requests: 0,
          avgResponseTime: 0,
          marketplace: true,
          price: 99,
          rating: 0,
          downloads: 0,
          status: "development",
          isActive: false,
          comingSoon: true,
          createdBy: { name: "Fleetopia Team", email: "team@fleetopia.co" },
          reviews: [],
          metrics: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Filter mock data if marketplace filter is applied
      if (marketplace === 'true') {
        return NextResponse.json(mockAgents.filter(agent => agent.marketplace));
      }
      
      return NextResponse.json(mockAgents);
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching AI agents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new AI Agent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      version,
      category,
      capabilities,
      configuration,
      performance,
      marketplace = false
    } = body;

    // Validation
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const agent = await prisma.aIAgent.create({
      data: {
        name,
        description,
        version: version || '1.0.0',
        category,
        capabilities: capabilities || {},
        configuration: configuration || {},
        performance: performance || {},
        marketplace,
        requiresAPI: true,
        userId: user.id
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating AI agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update AI Agent
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the agent
    const existingAgent = await prisma.aIAgent.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedAgent = await prisma.aIAgent.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Error updating AI agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete AI Agent
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the agent
    const existingAgent = await prisma.aIAgent.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.aIAgent.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
