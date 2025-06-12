
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Fleet Vehicles API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fleetId = searchParams.get('fleetId');
    const vehicleId = searchParams.get('vehicleId');
    const include = searchParams.get('include')?.split(',') || [];

    if (vehicleId) {
      // Get specific vehicle
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: {
          maintenances: include.includes('maintenance'),
          routes: include.includes('trips')
        }
      });

      if (!vehicle) {
        return NextResponse.json({
          success: false,
          error: 'Vehicle not found',
          timestamp: new Date()
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: vehicle,
        message: 'Vehicle retrieved successfully',
        timestamp: new Date()
      });
    } else {
      // Get vehicles for fleet
      const where = fleetId ? { fleetId } : {};
      const vehicles = await prisma.vehicle.findMany({
        where,
        include: {
          maintenances: include.includes('maintenance') ? { take: 5, orderBy: { scheduledAt: 'desc' } } : false,
          routes: include.includes('trips') ? { take: 5, orderBy: { createdAt: 'desc' } } : false
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: vehicles,
        total: vehicles.length,
        fleetId,
        message: 'Vehicles retrieved successfully',
        timestamp: new Date()
      });
    }

  } catch (error) {
    console.error('Fleet vehicles API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vehicle data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Add vehicle to fleet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      licensePlate, 
      name, 
      type,
      fleetId = 'default',
      status = 'active'
    } = body;

    console.log('Add vehicle request:', body);

    if (!licensePlate || !name || !type) {
      return NextResponse.json({
        success: false,
        error: 'License plate, name and type are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Check if license plate already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate }
    });

    if (existingVehicle) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle with this license plate already exists',
        timestamp: new Date()
      }, { status: 409 });
    }

    // Create fleet if it doesn't exist
    let fleet = await prisma.fleet.findFirst({
      where: { name: fleetId }
    });

    if (!fleet) {
      // Get first user as default owner, or create default user
      let firstUser = await prisma.user.findFirst();
      
      if (!firstUser) {
        // Create default user for fleet management
        firstUser = await prisma.user.create({
          data: {
            name: 'Fleet Manager',
            email: 'fleet@fleetopia.co',
            role: 'admin'
          }
        });
      }

      fleet = await prisma.fleet.create({
        data: {
          name: fleetId,
          status: 'active',
          userId: firstUser.id
        }
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        fleetId: fleet.id,
        name,
        type,
        licensePlate,
        status,
        fuelLevel: 100,
        mileage: 0
      }
    });

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: 'Vehicle added to fleet successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Vehicle creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add vehicle',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update vehicle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      vehicleId, 
      status, 
      currentLocation, 
      fuelLevel, 
      odometer,
      lastMaintenance,
      nextMaintenance
    } = body;

    if (!vehicleId) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (currentLocation) updateData.location = currentLocation;
    if (fuelLevel !== undefined) updateData.fuelLevel = fuelLevel;
    if (odometer !== undefined) updateData.mileage = odometer;

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: vehicle,
      message: 'Vehicle updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Vehicle update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update vehicle',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Remove vehicle from fleet
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    await prisma.vehicle.delete({
      where: { id: vehicleId }
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle removed from fleet successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Vehicle deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove vehicle',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
