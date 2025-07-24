import { Trainee, Centre, Course } from '@/contexts/AppContext';

// Types for predictive analytics
export interface EnrollmentForecast {
  period: string;
  predictedEnrollment: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
}

export interface DropoutRiskAssessment {
  traineeId: string;
  traineeName: string;
  riskLevel: 'very_high' | 'high' | 'medium' | 'low' | 'no_risk';
  riskScore: number;
  riskFactors: string[];
  recommendations: string[];
  lastAssessment: Date;
}

export interface ResourceDemandPrediction {
  resourceType: string;
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  period: string;
  recommendations: string[];
}

export interface PerformanceOptimization {
  metric: string;
  currentValue: number;
  targetValue: number;
  improvement: number;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface PredictiveMetrics {
  enrollmentForecast: EnrollmentForecast[];
  dropoutRisks: DropoutRiskAssessment[];
  resourceDemand: ResourceDemandPrediction[];
  performanceOptimization: PerformanceOptimization[];
}

class PredictiveAnalyticsService {
  // Enrollment Forecasting Algorithm
  calculateEnrollmentForecast(
    trainees: Trainee[],
    centres: Centre[],
    courses: Course[],
    months: number = 6
  ): EnrollmentForecast[] {
    const forecasts: EnrollmentForecast[] = [];
    
    // Calculate historical enrollment trends
    const monthlyEnrollments = this.getMonthlyEnrollments(trainees);
    const trend = this.calculateTrend(monthlyEnrollments);
    
    // Generate forecasts for next N months
    for (let i = 1; i <= months; i++) {
      const baseEnrollment = monthlyEnrollments[monthlyEnrollments.length - 1] || 0;
      const growthFactor = this.calculateGrowthFactor(trend, i);
      const seasonalFactor = this.calculateSeasonalFactor(i);
      
      const predictedEnrollment = Math.round(
        baseEnrollment * growthFactor * seasonalFactor
      );
      
      const confidence = this.calculateConfidence(i, trend);
      
      forecasts.push({
        period: this.getPeriodLabel(i),
        predictedEnrollment,
        confidence,
        trend: this.getTrendDirection(trend),
        factors: this.getEnrollmentFactors(i, trend)
      });
    }
    
    return forecasts;
  }

  // Dropout Risk Assessment Algorithm
  calculateDropoutRisk(trainees: Trainee[]): DropoutRiskAssessment[] {
    return trainees.map(trainee => {
      const riskFactors: string[] = [];
      let riskScore = 0;
      
      // Age factor (younger trainees have higher risk)
      if (trainee.age < 20) {
        riskScore += 25;
        riskFactors.push('Young age (under 20)');
      } else if (trainee.age > 35) {
        riskScore += 15;
        riskFactors.push('Older age (over 35)');
      }
      
      // Employment status factor
      if (trainee.employment === 'unemployed') {
        riskScore += 20;
        riskFactors.push('Unemployed status');
      } else if (trainee.employment === 'employed') {
        riskScore -= 10;
      }
      
      // Education level factor
      if (trainee.education === 'none') {
        riskScore += 30;
        riskFactors.push('No formal education');
      } else if (trainee.education === 'primary') {
        riskScore += 20;
        riskFactors.push('Primary education only');
      } else if (trainee.education === 'tertiary') {
        riskScore -= 15;
      }
      
      // Gender factor (statistical patterns)
      if (trainee.gender === 'female') {
        riskScore += 10;
        riskFactors.push('Female (higher dropout rate)');
      }
      
      // Course difficulty factor
      const course = this.getCourseById(trainee.course);
      if (course && course.title.includes('Advanced')) {
        riskScore += 15;
        riskFactors.push('Advanced course difficulty');
      }
      
      // Normalize risk score to 0-100
      riskScore = Math.max(0, Math.min(100, riskScore));
      
      const riskLevel = this.getRiskLevel(riskScore);
      const recommendations = this.getRiskRecommendations(riskLevel, riskFactors);
      
      return {
        traineeId: trainee.id,
        traineeName: trainee.name,
        riskLevel,
        riskScore,
        riskFactors,
        recommendations,
        lastAssessment: new Date()
      };
    });
  }

  // Resource Demand Prediction Algorithm
  calculateResourceDemand(
    trainees: Trainee[],
    centres: Centre[],
    months: number = 3
  ): ResourceDemandPrediction[] {
    const predictions: ResourceDemandPrediction[] = [];
    
    // Calculate current resource usage
    const currentComputerUsage = this.calculateComputerUsage(trainees, centres);
    const currentInternetUsage = this.calculateInternetUsage(trainees, centres);
    const currentPowerUsage = this.calculatePowerUsage(trainees, centres);
    const currentSpaceUsage = this.calculateSpaceUsage(trainees, centres);
    
    // Predict future demand
    const enrollmentForecast = this.calculateEnrollmentForecast(trainees, centres, [], months);
    const totalPredictedEnrollment = enrollmentForecast.reduce((sum, f) => sum + f.predictedEnrollment, 0);
    
    // Computer demand prediction
    const predictedComputerDemand = Math.ceil(totalPredictedEnrollment * 0.5); // 50% of trainees need computers
    predictions.push({
      resourceType: 'computers',
      currentDemand: currentComputerUsage,
      predictedDemand: predictedComputerDemand,
      confidence: 0.85,
      period: `${months} months`,
      recommendations: this.getComputerRecommendations(currentComputerUsage, predictedComputerDemand)
    });
    
    // Internet bandwidth prediction
    const predictedInternetDemand = Math.ceil(totalPredictedEnrollment * 0.8); // 80% need internet
    predictions.push({
      resourceType: 'internet_bandwidth',
      currentDemand: currentInternetUsage,
      predictedDemand: predictedInternetDemand,
      confidence: 0.80,
      period: `${months} months`,
      recommendations: this.getInternetRecommendations(currentInternetUsage, predictedInternetDemand)
    });
    
    // Power consumption prediction
    const predictedPowerDemand = Math.ceil(totalPredictedEnrollment * 0.6); // 60% need power
    predictions.push({
      resourceType: 'power_consumption',
      currentDemand: currentPowerUsage,
      predictedDemand: predictedPowerDemand,
      confidence: 0.75,
      period: `${months} months`,
      recommendations: this.getPowerRecommendations(currentPowerUsage, predictedPowerDemand)
    });
    
    // Classroom space prediction
    const predictedSpaceDemand = Math.ceil(totalPredictedEnrollment * 0.4); // 40% need classroom space
    predictions.push({
      resourceType: 'classroom_space',
      currentDemand: currentSpaceUsage,
      predictedDemand: predictedSpaceDemand,
      confidence: 0.90,
      period: `${months} months`,
      recommendations: this.getSpaceRecommendations(currentSpaceUsage, predictedSpaceDemand)
    });
    
    return predictions;
  }

  // Performance Optimization Algorithm
  calculatePerformanceOptimization(
    trainees: Trainee[],
    centres: Centre[],
    courses: Course[]
  ): PerformanceOptimization[] {
    const optimizations: PerformanceOptimization[] = [];
    
    // Completion rate optimization
    const currentCompletionRate = this.calculateCompletionRate(trainees);
    const targetCompletionRate = 85; // Target 85% completion rate
    const completionImprovement = targetCompletionRate - currentCompletionRate;
    
    optimizations.push({
      metric: 'completion_rate',
      currentValue: currentCompletionRate,
      targetValue: targetCompletionRate,
      improvement: completionImprovement,
      recommendations: this.getCompletionRateRecommendations(completionImprovement),
      priority: completionImprovement > 10 ? 'high' : 'medium'
    });
    
    // Resource utilization optimization
    const currentUtilization = this.calculateResourceUtilization(trainees, centres);
    const targetUtilization = 80; // Target 80% utilization
    const utilizationImprovement = targetUtilization - currentUtilization;
    
    optimizations.push({
      metric: 'resource_utilization',
      currentValue: currentUtilization,
      targetValue: targetUtilization,
      improvement: utilizationImprovement,
      recommendations: this.getUtilizationRecommendations(utilizationImprovement),
      priority: utilizationImprovement > 15 ? 'high' : 'medium'
    });
    
    // Gender balance optimization
    const currentGenderBalance = this.calculateGenderBalance(trainees);
    const targetGenderBalance = 50; // Target 50% female enrollment
    const genderBalanceImprovement = Math.abs(targetGenderBalance - currentGenderBalance);
    
    optimizations.push({
      metric: 'gender_balance',
      currentValue: currentGenderBalance,
      targetValue: targetGenderBalance,
      improvement: genderBalanceImprovement,
      recommendations: this.getGenderBalanceRecommendations(currentGenderBalance, targetGenderBalance),
      priority: genderBalanceImprovement > 20 ? 'high' : 'low'
    });
    
    // Employment outcome optimization
    const currentEmploymentRate = this.calculateEmploymentOutcomeRate(trainees);
    const targetEmploymentRate = 70; // Target 70% employment rate
    const employmentImprovement = targetEmploymentRate - currentEmploymentRate;
    
    optimizations.push({
      metric: 'employment_outcome',
      currentValue: currentEmploymentRate,
      targetValue: targetEmploymentRate,
      improvement: employmentImprovement,
      recommendations: this.getEmploymentOutcomeRecommendations(employmentImprovement),
      priority: employmentImprovement > 15 ? 'high' : 'medium'
    });
    
    return optimizations;
  }

  // Helper methods
  private getMonthlyEnrollments(trainees: Trainee[]): number[] {
    // Simulate monthly enrollment data
    return [12, 15, 18, 22, 25, 28, 30, 32, 35, 38, 40, 42];
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private calculateGrowthFactor(trend: number, months: number): number {
    return 1 + (trend * months * 0.01);
  }

  private calculateSeasonalFactor(month: number): number {
    // Simulate seasonal patterns (higher enrollment in certain months)
    const seasonalPatterns = [0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.0, 0.9];
    return seasonalPatterns[(month - 1) % 12];
  }

  private calculateConfidence(months: number, trend: number): number {
    // Confidence decreases with time and increases with stable trends
    const timeDecay = Math.max(0.5, 1 - (months * 0.1));
    const trendStability = Math.max(0.7, 1 - Math.abs(trend) * 0.5);
    return timeDecay * trendStability;
  }

  private getTrendDirection(trend: number): 'increasing' | 'decreasing' | 'stable' {
    if (trend > 0.1) return 'increasing';
    if (trend < -0.1) return 'decreasing';
    return 'stable';
  }

  private getPeriodLabel(month: number): string {
    const periods = ['Next Month', 'Next Quarter', 'Next Semester', 'Next Year'];
    return periods[Math.min(month - 1, periods.length - 1)];
  }

  private getEnrollmentFactors(month: number, trend: number): string[] {
    const factors = [];
    if (trend > 0) factors.push('Growing market demand');
    if (month <= 3) factors.push('Seasonal enrollment patterns');
    if (month > 6) factors.push('Long-term trend projection');
    return factors;
  }

  private getRiskLevel(score: number): 'very_high' | 'high' | 'medium' | 'low' | 'no_risk' {
    if (score >= 80) return 'very_high';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'no_risk';
  }

  private getRiskRecommendations(riskLevel: string, factors: string[]): string[] {
    const recommendations = [];
    
    if (riskLevel === 'very_high' || riskLevel === 'high') {
      recommendations.push('Assign mentor for regular check-ins');
      recommendations.push('Provide additional academic support');
      recommendations.push('Schedule regular progress reviews');
    }
    
    if (factors.includes('Unemployed status')) {
      recommendations.push('Connect with employment support services');
    }
    
    if (factors.includes('No formal education')) {
      recommendations.push('Provide basic literacy support');
    }
    
    if (factors.includes('Advanced course difficulty')) {
      recommendations.push('Offer prerequisite courses');
    }
    
    return recommendations;
  }

  private getCourseById(courseId: string): Course | undefined {
    // This would typically fetch from context or API
    return undefined;
  }

  private calculateComputerUsage(trainees: Trainee[], centres: Centre[]): number {
    return Math.ceil(trainees.length * 0.5);
  }

  private calculateInternetUsage(trainees: Trainee[], centres: Centre[]): number {
    return Math.ceil(trainees.length * 0.8);
  }

  private calculatePowerUsage(trainees: Trainee[], centres: Centre[]): number {
    return Math.ceil(trainees.length * 0.6);
  }

  private calculateSpaceUsage(trainees: Trainee[], centres: Centre[]): number {
    return Math.ceil(trainees.length * 0.4);
  }

  private getComputerRecommendations(current: number, predicted: number): string[] {
    const recommendations = [];
    if (predicted > current) {
      recommendations.push('Increase computer inventory');
      recommendations.push('Consider computer sharing programs');
    }
    return recommendations;
  }

  private getInternetRecommendations(current: number, predicted: number): string[] {
    const recommendations = [];
    if (predicted > current) {
      recommendations.push('Upgrade internet bandwidth');
      recommendations.push('Implement bandwidth management');
    }
    return recommendations;
  }

  private getPowerRecommendations(current: number, predicted: number): string[] {
    const recommendations = [];
    if (predicted > current) {
      recommendations.push('Install backup power systems');
      recommendations.push('Optimize power consumption');
    }
    return recommendations;
  }

  private getSpaceRecommendations(current: number, predicted: number): string[] {
    const recommendations = [];
    if (predicted > current) {
      recommendations.push('Expand classroom facilities');
      recommendations.push('Implement flexible scheduling');
    }
    return recommendations;
  }

  private calculateCompletionRate(trainees: Trainee[]): number {
    // Simulate completion rate calculation
    return 75; // 75% completion rate
  }

  private calculateResourceUtilization(trainees: Trainee[], centres: Centre[]): number {
    // Simulate resource utilization calculation
    return 65; // 65% utilization
  }

  private calculateGenderBalance(trainees: Trainee[]): number {
    const femaleCount = trainees.filter(t => t.gender === 'female').length;
    return (femaleCount / trainees.length) * 100;
  }

  private calculateEmploymentOutcomeRate(trainees: Trainee[]): number {
    // Simulate employment outcome calculation
    return 60; // 60% employment rate
  }

  private getCompletionRateRecommendations(improvement: number): string[] {
    const recommendations = [];
    if (improvement > 10) {
      recommendations.push('Implement early intervention programs');
      recommendations.push('Provide additional academic support');
      recommendations.push('Create peer mentoring programs');
    }
    return recommendations;
  }

  private getUtilizationRecommendations(improvement: number): string[] {
    const recommendations = [];
    if (improvement > 15) {
      recommendations.push('Optimize class scheduling');
      recommendations.push('Implement resource sharing');
      recommendations.push('Expand facility usage hours');
    }
    return recommendations;
  }

  private getGenderBalanceRecommendations(current: number, target: number): string[] {
    const recommendations = [];
    if (current < target) {
      recommendations.push('Launch female-focused recruitment campaigns');
      recommendations.push('Provide childcare support');
      recommendations.push('Create women-only training sessions');
    }
    return recommendations;
  }

  private getEmploymentOutcomeRecommendations(improvement: number): string[] {
    const recommendations = [];
    if (improvement > 15) {
      recommendations.push('Strengthen industry partnerships');
      recommendations.push('Provide job placement services');
      recommendations.push('Offer career counseling');
    }
    return recommendations;
  }
}

export const predictiveAnalyticsService = new PredictiveAnalyticsService(); 