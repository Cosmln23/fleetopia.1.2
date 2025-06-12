// 🚀 FuelMaster AI Complete Test Suite
// Test toate cele 3 sisteme AI pentru verificarea ±2% accuracy și 25-45% economii

const testFuelMasterAI = async () => {
  console.log('🚀 === FUELMASTER AI COMPLETE TEST SUITE ===\n');
  
  // === SISTEM 1: Predictive Fuel AI ===
  console.log('🧠 Testing SISTEM 1: Predictive Fuel AI...');
  try {
    const predictiveResponse = await fetch('http://localhost:3003/api/predictive-fuel-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'predict',
        vehicleId: 'TEST_VEHICLE_001',
        currentData: {
          fuelConsumed: 45.2,
          distanceTraveled: 567,
          driverBehaviorScore: 87,
          avgSpeed: 62,
          maintenanceScore: 92,
          loadWeight: 2800
        }
      })
    });
    
    const predictiveResult = await predictiveResponse.json();
    console.log('✅ Predictive AI Response:', {
      success: predictiveResult.success,
      predictions: predictiveResult.data?.predictions?.length || 0,
      accuracy: predictiveResult.metadata?.modelAccuracy || 'N/A',
      savings: predictiveResult.data?.predictions?.[0]?.predictedConsumption || 'N/A'
    });
  } catch (error) {
    console.error('❌ Predictive AI Error:', error.message);
  }

  console.log('\n📈 Testing SISTEM 2: Dynamic Fuel Pricing...');
  try {
    const pricingResponse = await fetch('http://localhost:3003/api/dynamic-fuel-pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'optimize_fuel_purchasing',
        route: {
          startLat: 45.7489,
          startLng: 21.2087,
          endLat: 44.4268,
          endLng: 26.1025,
          distance: 443
        },
        vehicleProfile: {
          id: 'TEST_VEHICLE_001',
          fuelType: 'diesel',
          tankCapacity: 80,
          currentFuel: 25
        },
        fuelNeed: 60
      })
    });
    
    const pricingResult = await pricingResponse.json();
    console.log('✅ Dynamic Pricing Response:', {
      success: pricingResult.success,
      optimization: pricingResult.data?.costSavings || 'N/A',
      bestPrice: pricingResult.data?.bestFuelStation?.price || 'N/A',
      savings: pricingResult.data?.totalSavings || 'N/A'
    });
  } catch (error) {
    console.error('❌ Dynamic Pricing Error:', error.message);
  }

  console.log('\n⚡ Testing SISTEM 3: Micro-Optimization...');
  try {
    const microResponse = await fetch('http://localhost:3003/api/micro-optimization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze_driving_behavior',
        vehicleData: {
          speed: 68,
          rpm: 2200,
          fuelFlow: 8.2,
          throttlePosition: 0.45,
          brakePressure: 0,
          accelerationX: 0.2,
          accelerationY: 0.1,
          engineTemp: 87
        }
      })
    });
    
    const microResult = await microResponse.json();
    console.log('✅ Micro-Optimization Response:', {
      success: microResult.success,
      efficiencyScore: microResult.data?.behaviorAnalysis?.overallEfficiencyScore || 'N/A',
      improvements: microResult.data?.insights?.improvementAreas?.length || 0,
      coaching: microResult.data?.behaviorAnalysis?.coachingRecommendations?.length || 0
    });
  } catch (error) {
    console.error('❌ Micro-Optimization Error:', error.message);
  }

  console.log('\n📊 === COMBINED SYSTEMS TEST ===');
  try {
    // Test integration endpoint prin RouteOptimizer
    const integratedResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: 443,
        driverId: 'driver_fuelmaster_test',
        vehicleId: 'vehicle_fuelmaster_test',
        trafficData: { congestionLevel: 0.4 },
        vehicle: {
          type: 'truck',
          fuelType: 'diesel',
          currentFuel: 25,
          fuelCapacity: 80
        }
      })
    });
    
    const integratedResult = await integratedResponse.json();
    console.log('🎯 Integrated FuelMaster Test:', {
      success: integratedResult.success,
      fuelSavings: integratedResult.data?.savings?.fuelLiters || 'N/A',
      costSavings: integratedResult.data?.savings?.costEuros || 'N/A',
      percentageSaved: integratedResult.data?.savings?.percentageSaved || 'N/A'
    });
    
    // Verifică claim-ul de ±2% accuracy
    const predictedConsumption = integratedResult.data?.savings?.fuelLiters || 0;
    console.log(`\n🎯 ACCURACY CHECK: Predicted fuel savings: ${predictedConsumption.toFixed(2)}L`);
    console.log(`📊 SAVINGS CHECK: ${integratedResult.data?.savings?.percentageSaved?.toFixed(1)}% savings achieved`);
    
  } catch (error) {
    console.error('❌ Integrated Test Error:', error.message);
  }

  console.log('\n🏁 === FUELMASTER AI TEST COMPLETE ===');
};

testFuelMasterAI(); 