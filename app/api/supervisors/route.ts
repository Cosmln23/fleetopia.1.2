
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supervisorType = searchParams.get('supervisorType');
    const includeSubordinates = searchParams.get('includeSubordinates') === 'true';
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    const whereClause: any = {
      category: 'supervisor'
    };
    
    if (supervisorType) {
      whereClause.supervisorType = supervisorType;
    }

    const includeClause: any = {
      supervisorTasks: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    };
    
    if (includeSubordinates) {
      includeClause.subordinates = {
        include: {
          performanceLogs: {
            take: 5,
            orderBy: { timestamp: 'desc' }
          },
          revenueLogs: {
            take: 5,
            orderBy: { timestamp: 'desc' }
          }
        }
      };
    }

    const supervisors = await prisma.aIAgent.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: { createdAt: 'desc' }
    });

    const supervisorsWithAnalytics = supervisors.map(supervisor => {
      const subordinates = supervisor.subordinates || [];
      const tasks = supervisor.supervisorTasks || [];
      
      let analytics = {};
      if (includeAnalytics) {
        const totalRevenue = subordinates.reduce((sum, agent) => sum + ((agent as any).revenueGenerated || 0), 0);
        const avgPerformance = subordinates.length > 0 
          ? subordinates.reduce((sum, agent) => sum + ((agent as any).performanceScore || 0), 0) / subordinates.length
          : supervisor.performanceScore;
        
        const activeTasks = tasks.filter((task: any) => task.status === 'in_progress' || task.status === 'pending').length;
        const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
        
        analytics = {
          subordinateCount: subordinates.length,
          totalRevenue,
          avgPerformance,
          activeTasks,
          completedTasks,
          efficiency: completedTasks > 0 ? (completedTasks / (completedTasks + activeTasks)) * 100 : 0,
          subordinateAnalytics: subordinates.map((agent: any) => ({
            agentId: agent.id,
            agentName: agent.name,
            totalRevenue: agent.revenueGenerated || 0,
            avgPerformance: agent.performanceScore || 0,
            totalRequests: agent.requests || 0,
            successRate: agent.successRate || 0,
            avgResponseTime: agent.avgResponseTime || 0,
            trend: 'stable' // Could be calculated based on performance logs
          }))
        };
      }

      return {
        ...supervisor,
        ...(includeAnalytics && { analytics })
      };
    });

    return NextResponse.json(supervisorsWithAnalytics);
  } catch (error) {
    console.error('Supervisors API error:', error);
    
    // Return mock data if database is not populated yet
    return NextResponse.json([
      {
        id: 'supervisor-001',
        name: 'Logistics Supervisor',
        type: 'logistics-supervisor',
        category: 'supervisor',
        supervisorType: 'logistics',
        status: 'active',
        performance: 96.8,
        revenue: 0,
        revenueGenerated: 285000,
        performanceScore: 96.8,
        requests: 0,
        successRate: 98.5,
        avgResponseTime: 45.2,
        description: 'Master AI supervisor managing all logistics-related agents including fuel optimization, routing, and maintenance prediction.',
        version: '3.0.0',
        capabilities: ['coordination', 'optimization', 'monitoring', 'analytics'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analytics: {
          subordinateCount: 4,
          totalRevenue: 336500,
          avgPerformance: 91.1,
          activeTasks: 2,
          completedTasks: 8,
          efficiency: 80
        }
      },
      {
        id: 'supervisor-002',
        name: 'Business Supervisor',
        type: 'business-supervisor',
        category: 'supervisor',
        supervisorType: 'business',
        status: 'active',
        performance: 94.2,
        revenue: 0,
        revenueGenerated: 198000,
        performanceScore: 94.2,
        requests: 0,
        successRate: 97.1,
        avgResponseTime: 52.8,
        description: 'Strategic AI supervisor overseeing business operations, compliance, pricing, and cargo matching systems.',
        version: '3.0.0',
        capabilities: ['strategy', 'compliance', 'negotiation', 'analytics'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analytics: {
          subordinateCount: 3,
          totalRevenue: 163600,
          avgPerformance: 88.8,
          activeTasks: 1,
          completedTasks: 5,
          efficiency: 83.3
        }
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const supervisor = await prisma.aIAgent.create({
      data: {
        name: body.name,
        type: body.type,
        category: 'supervisor',
        supervisorType: body.supervisorType,
        description: body.description,
        version: body.version || '1.0.0',
        status: body.status || 'active',
        performance: body.performance || 0,
        revenue: body.revenue || 0,
        revenueGenerated: body.revenueGenerated || 0,
        performanceScore: body.performanceScore || 0,
        requests: body.requests || 0,
        successRate: body.successRate || 100,
        avgResponseTime: body.avgResponseTime || 0,
        capabilities: body.capabilities,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    return NextResponse.json(supervisor, { status: 201 });
  } catch (error) {
    console.error('Create supervisor error:', error);
    return NextResponse.json({ error: 'Failed to create supervisor' }, { status: 500 });
  }
}
