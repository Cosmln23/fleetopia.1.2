
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Fleet Management API - Main fleet operations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fleetId = searchParams.get('fleetId');
    const include = searchParams.get('include')?.split(',') || [];

    if (fleetId) {
      // Get specific fleet with related data
      const fleet = await prisma.fleet.findUnique({
        where: { id: fleetId },
        include: {
          vehicles: include.includes('vehicles'),
          drivers: include.includes('drivers'),
          routes: include.includes('routes')
        }
      });

      if (!fleet) {
        return NextResponse.json({
          success: false,
          error: 'Fleet not found',
          timestamp: new Date()
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: fleet,
        message: 'Fleet retrieved successfully',
        timestamp: new Date()
      });
    } else {
      // Get all fleets
      const fleets = await prisma.fleet.findMany({
        include: {
          vehicles: true,
          drivers: true,
          routes: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: fleets,
        total: fleets.length,
        message: 'Fleets retrieved successfully',
        timestamp: new Date()
      });
    }

  } catch (error) {
    console.error('Fleet management API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch fleet data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Create new fleet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, ownerId } = body;

    if (!name || !ownerId) {
      return NextResponse.json({
        success: false,
        error: 'Name and owner ID are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const fleet = await prisma.fleet.create({
      data: {
        name,
        description,
        ownerId,
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      data: fleet,
      message: 'Fleet created successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Fleet creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create fleet',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update fleet
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fleetId, name, description, status } = body;

    if (!fleetId) {
      return NextResponse.json({
        success: false,
        error: 'Fleet ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const fleet = await prisma.fleet.update({
      where: { id: fleetId },
      data: {
        name,
        description,
        status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: fleet,
      message: 'Fleet updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Fleet update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update fleet',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Delete fleet
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fleetId = searchParams.get('fleetId');

    if (!fleetId) {
      return NextResponse.json({
        success: false,
        error: 'Fleet ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    await prisma.fleet.delete({
      where: { id: fleetId }
    });

    return NextResponse.json({
      success: true,
      message: 'Fleet deleted successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Fleet deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete fleet',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
