
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Real-time Data API - Aggregated real-time information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const fleetId = searchParams.get('fleetId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const realTimeData: any = {};

    // Vehicle tracking data
    if (type === 'all' || type === 'tracking') {
      const trackingWhere = fleetId ? {
        vehicle: { fleetId }
      } : {};

      realTimeData.vehicleTracking = await prisma.realTimeTracking.findMany({
        where: trackingWhere,
        orderBy: { timestamp: 'desc' },
        take: limit,
        include: {
          // Note: We'll need to add the relation in schema if needed
        }
      });
    }

    // Weather alerts
    if (type === 'all' || type === 'weather') {
      realTimeData.weatherAlerts = await prisma.weatherData.findMany({
        where: {
          alerts: {
            not: null
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      });
    }

    // Traffic incidents
    if (type === 'all' || type === 'traffic') {
      realTimeData.trafficIncidents = await prisma.trafficIncident.findMany({
        where: {
          endTime: {
            gte: new Date() // Only active incidents
          }
        },
        orderBy: { startTime: 'desc' },
        take: limit
      });
    }

    // Fuel prices
    if (type === 'all' || type === 'fuel') {
      realTimeData.fuelPrices = await prisma.fuelPrice.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      });
    }

    // System alerts
    if (type === 'all' || type === 'alerts') {
      const alertsWhere: any = {
        resolved: false
      };
      
      if (fleetId) {
        alertsWhere.OR = [
          { vehicle: { fleetId } },
          { driver: { fleetId } }
        ];
      }

      realTimeData.systemAlerts = await prisma.alert.findMany({
        where: alertsWhere,
        orderBy: { timestamp: 'desc' },
        take: limit
      });
    }

    // Live metrics calculation
    const liveMetrics = {
      activeVehicles: 0,
      ongoingTrips: 0,
      fuelEfficiency: 0,
      averageSpeed: 0,
      alertsCount: 0,
      complianceStatus: 0
    };

    if (type === 'all' || type === 'metrics') {
      // Active vehicles
      const activeVehiclesWhere = fleetId ? { fleetId, status: 'active' } : { status: 'active' };
      liveMetrics.activeVehicles = await prisma.modernVehicle.count({
        where: activeVehiclesWhere
      });

      // Ongoing trips
      const ongoingTripsWhere = fleetId ? { vehicle: { fleetId }, status: 'in_progress' } : { status: 'in_progress' };
      liveMetrics.ongoingTrips = await prisma.modernTrip.count({
        where: ongoingTripsWhere
      });

      // Recent fuel efficiency (mock calculation)
      liveMetrics.fuelEfficiency = 7.2 + Math.random() * 2; // L/100km

      // Average speed from recent tracking data
      const recentTracking = await prisma.realTimeTracking.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        },
        select: { speed: true }
      });

      if (recentTracking.length > 0) {
        const totalSpeed = recentTracking.reduce((sum, track) => sum + (track.speed || 0), 0);
        liveMetrics.averageSpeed = Math.round(totalSpeed / recentTracking.length);
      }

      // Alerts count
      const alertsWhere: any = { resolved: false };
      if (fleetId) {
        alertsWhere.OR = [
          { vehicle: { fleetId } },
          { driver: { fleetId } }
        ];
      }
      liveMetrics.alertsCount = await prisma.alert.count({ where: alertsWhere });

      // Compliance status (mock calculation)
      liveMetrics.complianceStatus = Math.floor(Math.random() * 10) + 90; // 90-100%
    }

    // Integration status
    const integrationStatus = {
      freight: Math.random() > 0.1,
      gps: Math.random() > 0.05,
      mapping: Math.random() > 0.05,
      weather: Math.random() > 0.1,
      traffic: Math.random() > 0.1,
      communication: Math.random() > 0.05,
      fuel: Math.random() > 0.1,
      compliance: Math.random() > 0.1,
      maintenance: Math.random() > 0.1,
      financial: Math.random() > 0.05
    };

    return NextResponse.json({
      success: true,
      data: {
        ...realTimeData,
        liveMetrics,
        integrationStatus
      },
      type,
      fleetId,
      timestamp: new Date(),
      message: 'Real-time data retrieved successfully'
    });

  } catch (error) {
    console.error('Real-time API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update real-time data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, vehicleId, fleetId } = body;

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Type and data are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'tracking':
        if (!vehicleId) {
          return NextResponse.json({
            success: false,
            error: 'Vehicle ID is required for tracking data',
            timestamp: new Date()
          }, { status: 400 });
        }

        result = await prisma.realTimeTracking.create({
          data: {
            vehicleId,
            location: data.location,
            speed: data.speed,
            heading: data.heading,
            status: data.status || 'moving',
            geofence: data.geofence,
            provider: data.provider || 'system',
            timestamp: new Date()
          }
        });
        break;

      case 'alert':
        result = await prisma.alert.create({
          data: {
            vehicleId: data.vehicleId,
            driverId: data.driverId,
            type: data.type,
            severity: data.severity,
            title: data.title,
            message: data.message,
            data: data.alertData,
            provider: data.provider || 'system'
          }
        });
        break;

      case 'weather':
        result = await prisma.weatherData.create({
          data: {
            location: data.location,
            provider: data.provider || 'system',
            current: data.current,
            forecast: data.forecast,
            alerts: data.alerts,
            roadRisk: data.roadRisk,
            visibility: data.visibility,
            timestamp: new Date()
          }
        });
        break;

      case 'traffic':
        result = await prisma.trafficData.create({
          data: {
            routeId: data.routeId,
            provider: data.provider || 'system',
            incidents: data.incidents,
            flow: data.flow,
            congestion: data.congestion,
            eta: data.eta,
            alerts: data.alerts,
            timestamp: new Date()
          }
        });
        break;

      default:
        return NextResponse.json({
          success: false,
          error: `Unsupported data type: ${type}`,
          timestamp: new Date()
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Real-time ${type} data updated successfully`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Real-time data update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update real-time data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
