import { NextRequest, NextResponse } from 'next/server';
import { routeOptimizationService } from '../../../lib/route-optimization-service';

// Function to analyze extreme conditions
function analyzeExtremeConditions(requestBody: any) {
  const conditions = {
    isExtreme: false,
    factors: [] as string[],
    severity: 'normal' as 'normal' | 'moderate' | 'severe' | 'extreme'
  };

  // Check distance extremes
  if (requestBody.distance > 500) {
    conditions.factors.push('very_long_distance');
    conditions.isExtreme = true;
  }
  if (requestBody.distance < 5) {
    conditions.factors.push('very_short_distance');
  }

  // Check traffic conditions
  if (requestBody.trafficData?.congestionLevel > 0.8) {
    conditions.factors.push('heavy_traffic');
    conditions.isExtreme = true;
  }

  // Check weather conditions
  if (requestBody.weatherData?.conditions === 'storm' || 
      requestBody.weatherData?.visibility === 'poor') {
    conditions.factors.push('severe_weather');
    conditions.isExtreme = true;
  }

  // Check vehicle conditions
  if (requestBody.vehicle?.currentFuel < 20) {
    conditions.factors.push('low_fuel');
    conditions.isExtreme = true;
  }
  if (requestBody.vehicle?.currentLoad > requestBody.vehicle?.maxLoad * 0.95) {
    conditions.factors.push('heavy_load');
  }

  // Check time constraints
  if (requestBody.timeConstraints?.maxDrivingTime < 240) {
    conditions.factors.push('tight_schedule');
    conditions.isExtreme = true;
  }

  // Determine severity
  if (conditions.factors.length >= 3) {
    conditions.severity = 'extreme';
  } else if (conditions.factors.length >= 2) {
    conditions.severity = 'severe';
  } else if (conditions.factors.length >= 1) {
    conditions.severity = 'moderate';
  }

  return conditions;
}

// Initialize enhanced service
routeOptimizationService.initialize().then(() => {
  console.log('✅ Enhanced Route Optimizer API ready with Historical Learning');
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const driverId = searchParams.get('driverId');
    const vehicleId = searchParams.get('vehicleId');

    switch (action) {
      case 'stats':
        const stats = routeOptimizationService.getStats();
        const insights = await routeOptimizationService.getLearningInsights();
        
        return NextResponse.json({
          success: true,
          data: {
            service: stats,
            learning: insights,
            info: {
              name: 'Enhanced ML Route Optimizer with Driver Personalization & Vehicle-Specific Optimization',
              version: '4.0.0',
              status: stats.initialized ? 'operational' : 'initializing',
              capabilities: [
                'Real-time route optimization',
                'ML-powered predictions',
                'Driver personalization and behavior learning',
                'Personalized coaching insights',
                'Fleet driver analytics and comparison',
                'Adaptive learning per driver profile',
                'Driver satisfaction tracking',
                'Vehicle-specific optimization',
                'Precise fuel consumption calculations',
                'Load impact analysis',
                'Maintenance status integration',
                'Legal restrictions handling',
                'Special vehicle support (electric, truck, motorcycle)',
                'Fleet vehicle analytics',
                'Operating cost calculations',
                'Historical route learning',
                'Pattern recognition',
                'Similarity-based enhancement',
                'Continuous model improvement',
                'Dynamic traffic adaptation',
                'Fuel cost optimization',
                'Weather-aware routing',
                'Seasonal adjustments'
              ],
              historicalRoutes: stats.historicalRoutes,
              averageAccuracy: `${(stats.averageAccuracy * 100).toFixed(1)}%`
            }
          },
          timestamp: new Date().toISOString()
        });

      case 'insights':
        const learningInsights = await routeOptimizationService.getLearningInsights();
        return NextResponse.json({
          success: true,
          data: learningInsights,
          timestamp: new Date().toISOString()
        });

      case 'patterns':
        const patterns = await routeOptimizationService.analyzeHistoricalPatterns();
        return NextResponse.json({
          success: true,
          data: patterns,
          timestamp: new Date().toISOString()
        });

      case 'driver-coaching':
        if (!driverId) {
          return NextResponse.json({
            success: false,
            error: 'Driver ID required for coaching insights'
          }, { status: 400 });
        }
        const coachingInsights = await routeOptimizationService.getDriverCoachingInsights(driverId);
        return NextResponse.json({
          success: true,
          data: {
            driverId: driverId,
            coaching: coachingInsights
          },
          timestamp: new Date().toISOString()
        });

      case 'driver-comparison':
        const driverId2 = searchParams.get('driverId2');
        if (!driverId || !driverId2) {
          return NextResponse.json({
            success: false,
            error: 'Two driver IDs required for comparison'
          }, { status: 400 });
        }
        const comparison = await routeOptimizationService.compareDriverPerformance(driverId, driverId2);
        return NextResponse.json({
          success: true,
          data: {
            drivers: [driverId, driverId2],
            comparison: comparison
          },
          timestamp: new Date().toISOString()
        });

      case 'fleet-analytics':
        const fleetAnalytics = await routeOptimizationService.getFleetDriverAnalytics();
        return NextResponse.json({
          success: true,
          data: fleetAnalytics,
          timestamp: new Date().toISOString()
        });

      case 'vehicle-profile':
        if (!vehicleId) {
          return NextResponse.json({
            success: false,
            error: 'Vehicle ID required for profile retrieval'
          }, { status: 400 });
        }
        const vehicleProfile = await routeOptimizationService.getVehicleProfile(vehicleId);
        return NextResponse.json({
          success: true,
          data: {
            vehicleId: vehicleId,
            profile: vehicleProfile
          },
          timestamp: new Date().toISOString()
        });

      case 'vehicle-analytics':
        const vehicleAnalytics = await routeOptimizationService.getFleetVehicleAnalytics();
        return NextResponse.json({
          success: true,
          data: vehicleAnalytics,
          timestamp: new Date().toISOString()
        });

      case 'all-vehicles':
        const allVehicles = await routeOptimizationService.getAllVehicleProfiles();
        return NextResponse.json({
          success: true,
          data: {
            vehicles: allVehicles,
            total: allVehicles.length
          },
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            name: 'Enhanced ML Route Optimizer API with Driver Personalization & Vehicle-Specific Optimization',
            version: '4.0.0',
            message: 'Driver Personalization & Vehicle-Specific Optimization System Active',
            endpoints: [
              'GET ?action=stats - Get comprehensive statistics + learning data',
              'GET ?action=insights - Get learning insights and recommendations',
              'GET ?action=patterns - Get historical patterns analysis',
              'GET ?action=driver-coaching&driverId=X - Get driver coaching insights',
              'GET ?action=driver-comparison&driverId=X&driverId2=Y - Compare two drivers',
              'GET ?action=fleet-analytics - Get fleet-wide driver analytics',
              'GET ?action=vehicle-profile&vehicleId=X - Get vehicle profile',
              'GET ?action=vehicle-analytics - Get fleet vehicle analytics',
              'GET ?action=all-vehicles - Get all vehicle profiles',
              'POST - Optimize route with enhanced ML + historical learning + driver personalization + vehicle optimization',
              'PUT - Provide learning feedback for continuous improvement + driver learning + vehicle learning'
            ],
            features: {
              driverPersonalization: true,
              driverCoaching: true,
              fleetAnalytics: true,
              driverComparison: true,
              vehicleOptimization: true,
              vehicleProfileManagement: true,
              fleetVehicleAnalytics: true,
              preciseFuelCalculation: true,
              loadImpactAnalysis: true,
              maintenanceIntegration: true,
              legalRestrictionsHandling: true,
              specialVehicleSupport: true,
              adaptiveLearning: true,
              historicalLearning: true,
              patternRecognition: true,
              similarityMatching: true,
              continuousImprovement: true,
              seasonalAdjustments: true
            }
          }
        });
    }
  } catch (error) {
    console.error('❌ Enhanced Route Optimizer API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n🚀 === ROUTE OPTIMIZER ML API - DETAILED LOGGING START ===');
    const requestStart = Date.now();
    
    const body = await request.json();
    const { distance, trafficData, vehicle, driver, weatherData, fuelPrices, timeConstraints, waypoints, driverId, vehicleId } = body;

    console.log('📥 Input Parameters:');
    console.log('  📏 Distance:', distance, 'km');
    console.log('  👤 Driver ID:', driverId || 'none');
    console.log('  🚛 Vehicle ID:', vehicleId || 'none');
    console.log('  🚦 Traffic Data:', trafficData ? 'provided' : 'none');
    console.log('  🌤️ Weather Data:', weatherData ? 'provided' : 'none');
    console.log('  ⛽ Fuel Prices:', fuelPrices ? 'provided' : 'none');
    console.log('  📍 Waypoints:', waypoints ? waypoints.length : 0);

    if (!distance || typeof distance !== 'number') {
      console.log('❌ Validation Failed: Distance missing or invalid');
      return NextResponse.json({
        success: false,
        error: 'Invalid input',
        message: 'Distance is required and must be a number'
      }, { status: 400 });
    }

    // Analyze input complexity for extreme conditions
    const isExtremeConditions = analyzeExtremeConditions(body);
    console.log('🌡️ Extreme Conditions Analysis:', isExtremeConditions);

    // Create optimization request
    const optimizationRequest = {
      distance,
      trafficData,
      vehicle,
      driver,
      weatherData,
      fuelPrices,
      timeConstraints,
      waypoints,
      driverId,
      vehicleId
    };

    console.log('\n🧠 Starting ML Optimization Process...');
    const mlStart = Date.now();
    
    // Optimize route using enhanced ML + historical learning + driver personalization + vehicle optimization
    const optimization = await routeOptimizationService.optimizeRoute(optimizationRequest);
    
    const mlDuration = Date.now() - mlStart;
    console.log('⚡ ML Processing completed in:', mlDuration, 'ms');

    // Detailed result analysis
    console.log('\n📊 === OPTIMIZATION RESULTS ANALYSIS ===');
    console.log('🎯 Basic ML Prediction:');
    console.log('  📐 Distance optimized:', optimization.distance, 'km');
    console.log('  ⏰ Duration optimized:', optimization.duration, 'minutes');
    console.log('  🎲 Optimization factor:', (optimization.optimizationFactor * 100).toFixed(1), '%');
    console.log('  🎖️ Confidence score:', (optimization.confidence * 100).toFixed(1), '%');

    // Driver personalization analysis
    if (optimization.personalizedForDriver) {
      console.log('\n👤 Driver Personalization Applied:');
      console.log('  🆔 Driver ID:', optimization.personalizedForDriver);
      console.log('  🎯 Personalization confidence:', 
        (optimization.driverPersonalization?.profileConfidence * 100 || 0).toFixed(1), '%');
      console.log('  ⚠️ Risk level:', optimization.driverPersonalization?.riskLevel || 'unknown');
      console.log('  🎯 Focus area:', optimization.driverPersonalization?.focusArea || 'general');
      console.log('  💡 Recommendations count:', 
        optimization.driverPersonalization?.recommendations?.length || 0);
    }

    // Vehicle optimization analysis
    if (optimization.vehicleOptimized) {
      console.log('\n🚛 Vehicle Optimization Applied:');
      console.log('  🆔 Vehicle ID:', optimization.vehicleId);
      console.log('  ⛽ Fuel efficiency gain:', 
        (optimization.vehicleOptimization?.fuelEfficiencyGain * 100 || 0).toFixed(1), '%');
      console.log('  💰 Cost savings:', '€', optimization.vehicleOptimization?.costSavings || 0);
      console.log('  🏋️ Load impact factor:', optimization.vehicleOptimization?.loadImpactFactor || 1);
    }

    // Historical learning analysis
    if (optimization.historicallyEnhanced) {
      console.log('\n🧠 Historical Learning Applied:');
      console.log('  📚 Based on routes:', optimization.basedOnSimilarRoutes);
      console.log('  🎯 Historical accuracy:', (optimization.historicalAccuracy * 100).toFixed(1), '%');
      console.log('  📈 Learning confidence factors:');
      optimization.learningData?.confidenceFactors?.forEach((factor, index) => {
        console.log(`    ${index + 1}. ${factor.factor}: ${(factor.confidence * 100).toFixed(1)}%`);
      });
    }

    // Extreme conditions handling
    if (isExtremeConditions.isExtreme) {
      console.log('\n🌡️ Extreme Conditions Handling:');
      console.log('  🚨 Severity level:', isExtremeConditions.severity);
      console.log('  ⚠️ Risk factors:', isExtremeConditions.factors.join(', '));
      console.log('  🛡️ Safety adjustments: Applied automatically');
    }

    // Final optimization summary
    const totalSavings = optimization.savings?.percentageSaved || 0;
    const totalDuration = Date.now() - requestStart;
    
    console.log('\n✅ === OPTIMIZATION SUMMARY ===');
    console.log('  💾 Total time savings:', totalSavings.toFixed(1), '%');
    console.log('  ⚡ API response time:', totalDuration, 'ms');
    console.log('  🔬 Algorithms used:', [
      optimization.historicallyEnhanced ? 'Historical' : null,
      optimization.personalizedForDriver ? 'Driver' : null,
      optimization.vehicleOptimized ? 'Vehicle' : null,
      'ML-Base'
    ].filter(Boolean).join(' + '));
    console.log('  🎯 Combined optimization:', optimization.combinedOptimization ? 'YES' : 'NO');
    console.log('🏁 === ROUTE OPTIMIZER ML API - DETAILED LOGGING END ===\n');
    
    return NextResponse.json({
      success: true,
      data: {
        ...optimization,
        enhanced: true,
        historicalLearningApplied: optimization.historicallyEnhanced || false,
        driverPersonalizationApplied: optimization.personalizedForDriver ? true : false,
        vehicleOptimizationApplied: optimization.vehicleOptimized || false,
        personalizedForDriver: optimization.personalizedForDriver || null,
        optimizedForVehicle: optimization.vehicleId || null,
        combinedOptimization: optimization.combinedOptimization || false,
        extremeConditions: isExtremeConditions,
        processingTime: {
          mlProcessing: mlDuration,
          totalRequest: totalDuration
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Enhanced Route Optimization Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Optimization failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeId, actualResult, driverId, vehicleId, vehicleData } = body;

    if (!routeId) {
      return NextResponse.json({
        success: false,
        error: 'Route ID is required'
      }, { status: 400 });
    }

    // Handle vehicle profile creation/update
    if (vehicleData && vehicleId) {
      const vehicleProfile = await routeOptimizationService.createVehicleProfile(vehicleId, vehicleData);
      
      if (vehicleProfile) {
        return NextResponse.json({
          success: true,
          message: 'Vehicle profile created/updated successfully',
          data: {
            vehicleId: vehicleId,
            profile: vehicleProfile
          },
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to create/update vehicle profile'
        }, { status: 500 });
      }
    }

    // Handle learning feedback
    if (actualResult) {
      const success = await routeOptimizationService.reportActualResult(routeId, actualResult, driverId, vehicleId);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Learning feedback recorded successfully',
          data: {
            routeId: routeId,
            driverUpdated: !!driverId,
            vehicleUpdated: !!vehicleId,
            learningApplied: true
          },
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to record learning feedback'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Either actualResult or vehicleData is required'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Learning Feedback Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Learning feedback failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 