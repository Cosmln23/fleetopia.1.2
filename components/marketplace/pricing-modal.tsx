'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  Zap, 
  Crown, 
  Star, 
  Users, 
  Shield, 
  Infinity,
  X
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  enterprise?: boolean;
  icon: React.ReactNode;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentDescription: string;
  onSelectPlan: (planId: string, planName: string, price: number) => void;
}

export function PricingModal({ 
  isOpen, 
  onClose, 
  agentName, 
  agentDescription,
  onSelectPlan 
}: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small fleets getting started',
      price: 29,
      period: 'month',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Up to 5 vehicles',
        'Basic analytics',
        'Email support',
        'Core AI features',
        'Monthly reports'
      ],
      limitations: [
        'Limited API calls (1,000/month)',
        'Basic customization',
        'Standard support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Most popular for growing businesses',
      price: 89,
      period: 'month',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Up to 50 vehicles',
        'Advanced analytics & AI',
        'Priority support',
        'Custom integrations',
        'Real-time monitoring',
        'Advanced reporting',
        'Team collaboration'
      ],
      limitations: [
        'API calls (10,000/month)',
        'Advanced customization'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large fleets with custom needs',
      price: 249,
      period: 'month',
      enterprise: true,
      icon: <Shield className="w-6 h-6" />,
      features: [
        'Unlimited vehicles',
        'Full AI suite access',
        'Dedicated support manager',
        'Custom development',
        'SLA guarantees',
        'Advanced security',
        'Multi-tenant support',
        'Custom branding',
        'API white-labeling'
      ]
    }
  ];

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan.id);
    onSelectPlan(plan.id, plan.name, plan.price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                Choose Your Plan for {agentName}
              </DialogTitle>
              <p className="text-slate-400 text-sm">{agentDescription}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card 
                className={`h-full cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-blue-500 bg-slate-800/80 border-blue-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                } ${plan.popular ? 'scale-105 border-blue-500/50' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      plan.enterprise ? 'bg-purple-600/20 text-purple-400' :
                      plan.popular ? 'bg-blue-600/20 text-blue-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {plan.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400 ml-1">/{plan.period}</span>
                    </div>
                    {plan.enterprise && (
                      <p className="text-xs text-purple-400 mt-1">Custom pricing available</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Includes:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-slate-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Select Button */}
                  <Button
                    className={`w-full transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">30-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Infinity className="w-4 h-4" />
              <span className="text-sm">24/7 support</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => {
              const selected = plans.find(p => p.id === selectedPlan);
              if (selected) handleSelectPlan(selected);
            }}
          >
            Continue to Checkout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 