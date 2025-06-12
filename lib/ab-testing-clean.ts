// A/B Testing System for FleetOpia

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  isActive: boolean;
  trafficSplit: number;
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

export class ABTestingSystem {
  private tests: Map<string, ABTest> = new Map();

  addTest(test: ABTest): void {
    this.tests.set(test.id, test);
  }

  getVariant(testId: string, userId: string): ABVariant | null {
    const test = this.tests.get(testId);
    if (!test || !test.isActive) {
      return null;
    }

    const hash = this.hashCode(userId + testId);
    const normalizedHash = Math.abs(hash) % 100;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (normalizedHash < cumulativeWeight) {
        return variant;
      }
    }

    return test.variants[0] || null;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  isTestActive(testId: string): boolean {
    const test = this.tests.get(testId);
    return test ? test.isActive : false;
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }
}

export const abTestingSystem = new ABTestingSystem(); 