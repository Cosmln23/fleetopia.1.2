'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, BarChart3 } from 'lucide-react';

export default function RouteOptimizerDemo() {
  const [demoResults, setDemoResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDemo = async () => {
    setLoading(true);
    setTimeout(() => {
      setDemoResults({
        oldSystem: 1500,
        newAI: 4300,
        extraSavings: 2800,
        breakEvenDays: 1
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          RouteOptimizer Pro AI Demo
        </h1>
        <p className="text-xl text-gray-300">
          Smart AI that learns from your fleet experience
        </p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            BEFORE vs AFTER Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                BEFORE (Current Version)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Savings:</span>
                  <Badge className="bg-red-500/20 text-red-400">8% fixed</Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Standard route optimization
                </p>
              </div>
            </div>

            <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                AFTER (With AI upgrade)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Savings:</span>
                  <Badge className="bg-green-500/20 text-green-400">23% adaptive</Badge>
                </div>
                <p className="text-sm text-gray-300">
                  AI-powered personalized optimization
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-yellow-400" />
            ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button onClick={runDemo} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'Calculating...' : 'Calculate ROI'}
            </Button>

            {demoResults && (
              <div className="bg-blue-900/30 p-6 rounded border border-blue-500/30">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Results:</h4>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">${demoResults.oldSystem}</div>
                    <div className="text-sm text-gray-400">Old Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">${demoResults.newAI}</div>
                    <div className="text-sm text-gray-400">AI Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">${demoResults.extraSavings}</div>
                    <div className="text-sm text-gray-400">Extra Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{demoResults.breakEvenDays}</div>
                    <div className="text-sm text-gray-400">Days to ROI</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
