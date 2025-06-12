// 🚚 DeliveryPredictor Debug Test - Finding the 500 error cause
const testDeliveryPredictorDebug = async () => {
  console.log('🚚 === DELIVERYPREDICTOR DEBUG TEST ===\n');

  // TEST 1: Empty POST request
  console.log('1️⃣ Testing empty POST request...');
  try {
    const response1 = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    console.log(`   Status: ${response1.status}`);
    if (!response1.ok) {
      const error = await response1.text();
      console.log(`   Error: ${error}`);
    } else {
      const result = await response1.json();
      console.log(`   Success: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.log(`   Exception: ${error.message}`);
  }

  console.log('\n2️⃣ Testing minimal valid request...');
  try {
    const response2 = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'predict_delivery'
      })
    });
    console.log(`   Status: ${response2.status}`);
    if (!response2.ok) {
      const error = await response2.text();
      console.log(`   Error: ${error}`);
    } else {
      const result = await response2.json();
      console.log(`   Success: ${JSON.stringify(result, null, 2)}`);
    }
  } catch (error) {
    console.log(`   Exception: ${error.message}`);
  }

  console.log('\n3️⃣ Testing with basic data...');
  try {
    const response3 = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'predict_delivery',
        data: {
          customerId: 'test_customer_001',
          urgency: 'standard'
        }
      })
    });
    console.log(`   Status: ${response3.status}`);
    if (!response3.ok) {
      const error = await response3.text();
      console.log(`   Error: ${error}`);
    } else {
      const result = await response3.json();
      console.log(`   Success: Prediction completed`);
      console.log(`   ETA: ${result.result?.estimatedDeliveryTime?.mostLikely || 'N/A'} min`);
      console.log(`   Price: €${result.result?.dynamicPricing?.finalPrice || 'N/A'}`);
    }
  } catch (error) {
    console.log(`   Exception: ${error.message}`);
  }

  console.log('\n4️⃣ Testing complete request...');
  try {
    const response4 = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'predict_delivery',
        data: {
          customerId: 'premium_customer_001',
          origin: { lat: 45.7489, lng: 21.2087, address: 'Timișoara' },
          destination: { lat: 44.4268, lng: 26.1025, address: 'București' },
          preferredTimeSlot: '14:00-16:00',
          packageDetails: {
            weight: 2.5,
            dimensions: { length: 30, width: 20, height: 15 },
            value: 150,
            fragile: false
          },
          urgency: 'express',
          currentConditions: {
            weather: 'clear',
            traffic: 'medium'
          }
        }
      })
    });
    console.log(`   Status: ${response4.status}`);
    if (!response4.ok) {
      const error = await response4.text();
      console.log(`   Error: ${error}`);
    } else {
      const result = await response4.json();
      console.log(`   ✅ FULL SUCCESS!`);
      console.log(`   ETA: ${result.result?.estimatedDeliveryTime?.mostLikely || 'N/A'} min`);
      console.log(`   Price: €${result.result?.dynamicPricing?.finalPrice || 'N/A'}`);
      console.log(`   Route: ${result.result?.routeOptimization?.recommendedRoute?.name || 'N/A'}`);
      console.log(`   Risk: ${result.result?.riskAssessment?.deliveryRisk || 'N/A'}`);
    }
  } catch (error) {
    console.log(`   Exception: ${error.message}`);
  }

  console.log('\n5️⃣ Testing other actions...');
  
  // Test get_pricing action
  try {
    const pricingResponse = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_pricing',
        data: {
          urgency: 'premium',
          customerSegment: 'vip',
          preferredTimeSlot: '18:00-20:00'
        }
      })
    });
    console.log(`   get_pricing Status: ${pricingResponse.status}`);
    if (pricingResponse.ok) {
      const result = await pricingResponse.json();
      console.log(`   Pricing: €${result.result?.pricing?.finalPrice || 'N/A'}`);
    }
  } catch (error) {
    console.log(`   get_pricing Exception: ${error.message}`);
  }

  // Test get_agent_status action
  try {
    const statusResponse = await fetch('http://localhost:3003/api/delivery-predictor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_agent_status'
      })
    });
    console.log(`   get_agent_status Status: ${statusResponse.status}`);
    if (statusResponse.ok) {
      const result = await statusResponse.json();
      console.log(`   Agent accuracy: ${result.result?.performance?.accuracy || 'N/A'}%`);
    }
  } catch (error) {
    console.log(`   get_agent_status Exception: ${error.message}`);
  }

  console.log('\n🏁 === DEBUG TEST COMPLETE ===');
};

testDeliveryPredictorDebug(); 