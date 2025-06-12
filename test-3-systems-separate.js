// Test separate pentru cele 3 sisteme FuelMaster AI
const test3SystemsSeparate = async () => {
  console.log('🚀 Testing 3 FuelMaster AI Systems Separately\n');

  // === SISTEM 1: Predictive Fuel AI ===
  console.log('🧠 SISTEM 1: Predictive Fuel AI');
  try {
    const response1 = await fetch('http://localhost:3003/api/predictive-fuel-ai?action=demo_data');
    const result1 = await response1.json();
    console.log('✅ Predictive AI Available:', response1.status === 200);
    console.log('📊 Demo predictions:', result1.data?.predictions?.length || 0);
  } catch (error) {
    console.error('❌ Predictive AI Error:', error.message);
  }

  console.log('\n📈 SISTEM 2: Dynamic Fuel Pricing');
  try {
    const response2 = await fetch('http://localhost:3003/api/dynamic-fuel-pricing?action=demo_data');
    const result2 = await response2.json();
    console.log('✅ Dynamic Pricing Available:', response2.status === 200);
    console.log('💰 Market optimization:', result2.data?.marketOptimization || 'Available');
  } catch (error) {
    console.error('❌ Dynamic Pricing Error:', error.message);
  }

  console.log('\n⚡ SISTEM 3: Micro-Optimization');
  try {
    const response3 = await fetch('http://localhost:3003/api/micro-optimization?action=system_status');
    const result3 = await response3.json();
    console.log('✅ Micro-Optimization Available:', response3.status === 200);
    console.log('🎯 Real-time coaching:', result3.data?.realTimeCoaching || 'Available');
  } catch (error) {
    console.error('❌ Micro-Optimization Error:', error.message);
  }

  // === Test Combined Power ===
  console.log('\n🔥 COMBINED SYSTEMS TEST');
  try {
    // Test cu toate sistemele activate
    const combinedResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: 500,
        driverId: 'driver_advanced_test',
        vehicleId: 'vehicle_advanced_test',
        // Advanced parameters pentru maximum optimization
        trafficData: {
          congestionLevel: 0.6,
          avgSpeed: 45,
          rushHour: true
        },
        vehicle: {
          type: 'truck',
          fuelType: 'diesel',
          currentFuel: 30,
          fuelCapacity: 80,
          maintenanceStatus: 'excellent'
        },
        weatherData: {
          temperature: 15,
          conditions: 'clear',
          windSpeed: 8
        },
        // Enable all optimizations
        enablePredictiveFuel: true,
        enableDynamicPricing: true,
        enableMicroOptimization: true
      })
    });
    
    const combinedResult = await combinedResponse.json();
    console.log('🎯 Combined optimization result:');
    console.log(`   Distance: ${combinedResult.data?.distance || 'N/A'}km`);
    console.log(`   Fuel savings: ${combinedResult.data?.savings?.fuelLiters || 'N/A'}L`);
    console.log(`   Cost savings: €${combinedResult.data?.savings?.costEuros || 'N/A'}`);
    console.log(`   Percentage saved: ${combinedResult.data?.savings?.percentageSaved || 'N/A'}%`);
    
  } catch (error) {
    console.error('❌ Combined test error:', error.message);
  }

  console.log('\n🏁 Individual systems testing complete!');
};

test3SystemsSeparate(); 