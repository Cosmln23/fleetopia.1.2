// Test pentru verificarea claim-ului ±2% fuel accuracy
const testAccuracyClaim = async () => {
  console.log('🎯 TESTING ±2% FUEL ACCURACY CLAIM\n');

  const testCases = [
    { distance: 100, expectedFuel: 8.5, description: 'Short city route' },
    { distance: 300, expectedFuel: 22.1, description: 'Medium highway route' },
    { distance: 500, expectedFuel: 34.8, description: 'Long mixed route' },
    { distance: 800, expectedFuel: 52.3, description: 'Very long route' }
  ];

  let totalTests = 0;
  let accurateTests = 0;

  for (const testCase of testCases) {
    console.log(`📊 Testing: ${testCase.description} (${testCase.distance}km)`);
    
    try {
      // 1. Get prediction from FuelMaster AI
      const response = await fetch('http://localhost:3003/api/route-optimizer-ml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distance: testCase.distance,
          vehicle: {
            type: 'truck',
            fuelType: 'diesel',
            avgConsumption: 8.5 // L/100km baseline
          },
          trafficData: { congestionLevel: 0.3 },
          weatherData: { temperature: 18, conditions: 'clear' }
        })
      });
      
      const result = await response.json();
      
      // 2. Calculate predicted fuel consumption
      const baseConsumption = (testCase.distance / 100) * 8.5; // Baseline
      const optimizedDistance = result.data?.distance || testCase.distance;
      const predictedFuel = (optimizedDistance / 100) * 8.5;
      
      // 3. Calculate accuracy vs expected real consumption
      const expectedFuel = testCase.expectedFuel;
      const accuracyPercentage = Math.abs(predictedFuel - expectedFuel) / expectedFuel * 100;
      
      console.log(`   Expected fuel: ${expectedFuel}L`);
      console.log(`   Predicted fuel: ${predictedFuel.toFixed(2)}L`);
      console.log(`   Accuracy: ±${accuracyPercentage.toFixed(2)}%`);
      
      // 4. Check if within ±2% claim
      const withinClaim = accuracyPercentage <= 2.0;
      console.log(`   ✅ Within ±2% claim: ${withinClaim ? 'YES' : 'NO'}`);
      
      totalTests++;
      if (withinClaim) accurateTests++;
      
    } catch (error) {
      console.error(`   ❌ Test failed: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  // Summary
  const successRate = (accurateTests / totalTests) * 100;
  console.log('📈 ACCURACY TEST SUMMARY:');
  console.log(`   Tests performed: ${totalTests}`);
  console.log(`   Within ±2% accuracy: ${accurateTests}`);
  console.log(`   Success rate: ${successRate.toFixed(1)}%`);
  console.log(`   Claim verification: ${successRate >= 80 ? '✅ VERIFIED' : '❌ NOT VERIFIED'}`);

  // Additional test with real-world scenario
  console.log('\n🚛 REAL-WORLD SCENARIO TEST:');
  try {
    const realWorldResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: 443, // Timișoara to București
        vehicle: {
          type: 'truck',
          fuelType: 'diesel',
          currentFuel: 25,
          fuelCapacity: 80,
          avgConsumption: 8.2,
          loadWeight: 15000
        },
        trafficData: {
          congestionLevel: 0.5,
          avgSpeed: 55,
          rushHour: true
        },
        weatherData: {
          temperature: 12,
          conditions: 'light_rain',
          windSpeed: 15
        }
      })
    });
    
    const realResult = await realWorldResponse.json();
    const realPredictedFuel = (realResult.data?.distance || 443) / 100 * 8.2;
    const expectedRealFuel = 443 / 100 * 8.2 * 1.1; // +10% for conditions
    const realAccuracy = Math.abs(realPredictedFuel - expectedRealFuel) / expectedRealFuel * 100;
    
    console.log(`   Route: Timișoara → București (${realResult.data?.distance || 443}km)`);
    console.log(`   Predicted fuel: ${realPredictedFuel.toFixed(2)}L`);
    console.log(`   Expected with conditions: ${expectedRealFuel.toFixed(2)}L`);
    console.log(`   Real-world accuracy: ±${realAccuracy.toFixed(2)}%`);
    console.log(`   ±2% claim met: ${realAccuracy <= 2.0 ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error('❌ Real-world test failed:', error.message);
  }
};

testAccuracyClaim(); 