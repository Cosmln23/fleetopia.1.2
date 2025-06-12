import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Mock traffic data generator
const generateMockTrafficData = (provider: string, routeId?: string) => {
  const providers = {
    tomtom: {
      provider: 'tomtom',
      features: ['real_time_incidents', 'flow_data', 'speed_limits', 'road_closures'],
      congestionLevel: Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'moderate' : 'light',
      averageSpeed: Math.floor(Math.random() * 40) + 40, // 40-80 km/h
      travelTime: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
      incidents: [
        {
          incidentId: `incident-${Date.now()}-1`,
          type: 'accident',
          severity: 'major',
          location: { lat: 40.7128, lng: -74.0060, address: 'Highway 95 Mile 45' },
          description: 'Multi-vehicle accident blocking 2 lanes',
          startTime: new Date(Date.now() - 30 * 60 * 1000),
          estimatedClearTime: new Date(Date.now() + 45 * 60 * 1000),
          impact: { delayMinutes: 25, affectedLanes: 2 }
        }
      ],
      alternativeRoutes: [
        { routeId: 'alt-1', description: 'Via Highway 1', additionalTime: 15, fuelSavings: '5%' },
        { routeId: 'alt-2', description: 'Via Local Roads', additionalTime: 25, fuelSavings: '12%' }
      ]
    },
    inrix: {
      provider: 'inrix',
      features: ['predictive_analytics', 'historical_patterns', 'commercial_vehicle_routing'],
      congestionLevel: Math.random() > 0.6 ? 'heavy' : Math.random() > 0.3 ? 'moderate' : 'light',
      averageSpeed: Math.floor(Math.random() * 35) + 45,
      travelTime: Math.floor(Math.random() * 50) + 35,
      incidents: [
        {
          incidentId: `incident-${Date.now()}-2`,
          type: 'construction',
          severity: 'moderate',
          location: { lat: 40.7589, lng: -73.9851, address: 'Interstate 278 Exit 45' },
          description: 'Road construction - single lane closure',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estimatedClearTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
          impact: { delayMinutes: 12, affectedLanes: 1 }
        }
      ],
      alternativeRoutes: [
        { routeId: 'alt-3', description: 'Express Route', additionalTime: 8, fuelSavings: '3%' }
      ]
    },
    waze: {
      provider: 'waze',
      features: ['community_reports', 'police_alerts', 'hazard_reports', 'speed_cameras'],
      congestionLevel: Math.random() > 0.5 ? 'moderate' : 'light',
      averageSpeed: Math.floor(Math.random() * 30) + 50,
      travelTime: Math.floor(Math.random() * 40) + 25,
      incidents: [
        {
          incidentId: `incident-${Date.now()}-3`,
          type: 'police',
          severity: 'low',
          location: { lat: 40.6892, lng: -74.0445, address: 'Route 9 Southbound' },
          description: 'Police activity reported by community',
          startTime: new Date(Date.now() - 15 * 60 * 1000),
          reportedBy: 'community',
          confidence: 0.78,
          impact: { delayMinutes: 5, affectedLanes: 0 }
        }
      ],
      alternativeRoutes: [
        { routeId: 'alt-4', description: 'Community Suggested Route', additionalTime: 5, fuelSavings: '2%' }
      ]
    }
  };

  return providers[provider as keyof typeof providers] || providers.tomtom;
};

// GET traffic data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'tomtom';
    const routeId = searchParams.get('routeId');
    const realTime = searchParams.get('realTime') === 'true';

    const trafficData = generateMockTrafficData(provider, routeId || undefined);

    // Mock traffic data storage
    console.log(`Traffic data processed for route ${routeId}:`, trafficData.congestionLevel);

    return NextResponse.json({
      success: true,
      data: trafficData,
      routeId,
      realTime,
      message: `Traffic data retrieved from ${provider}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Traffic API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch traffic data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Report traffic incident
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      severity, 
      location, 
      description, 
      provider = 'user_report' 
    } = body;

    if (!type || !location || !description) {
      return NextResponse.json({
        success: false,
        error: 'Type, location, and description are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock incident report
    const incidentReport = {
      incidentId: `user-report-${Date.now()}`,
      type,
      severity: severity || 'unknown',
      location,
      description,
      reportedBy: provider,
      reportedAt: new Date(),
      status: 'pending_verification',
      confidence: 0.65
    };

    return NextResponse.json({
      success: true,
      data: incidentReport,
      message: 'Traffic incident reported successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Traffic incident reporting error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to report traffic incident',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update traffic conditions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { incidentId, status, estimatedClearTime } = body;

    if (!incidentId) {
      return NextResponse.json({
        success: false,
        error: 'Incident ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock incident update
    const updatedIncident = {
      incidentId,
      status: status || 'updated',
      estimatedClearTime: estimatedClearTime ? new Date(estimatedClearTime) : null,
      lastUpdated: new Date(),
      confidence: 0.88
    };

    return NextResponse.json({
      success: true,
      data: updatedIncident,
      message: 'Traffic incident updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Traffic incident update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update traffic incident',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
