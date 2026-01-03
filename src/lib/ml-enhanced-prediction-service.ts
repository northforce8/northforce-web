import { logger } from './logger';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface Prediction {
  timestamp: number;
  value: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: number;
  seasonality: boolean;
  volatility: number;
}

class MLEnhancedPredictionService {
  private normalizeData(data: DataPoint[]): { mean: number; std: number; normalized: number[] } {
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    const normalized = values.map(v => (std === 0 ? 0 : (v - mean) / std));

    return { mean, std, normalized };
  }

  private denormalize(value: number, mean: number, std: number): number {
    return value * std + mean;
  }

  linearRegression(data: DataPoint[]): {
    slope: number;
    intercept: number;
    rSquared: number;
  } {
    const n = data.length;
    if (n < 2) {
      return { slope: 0, intercept: 0, rSquared: 0 };
    }

    const sumX = data.reduce((sum, d, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumX2 = data.reduce((sum, d, i) => sum + i * i, 0);
    const sumY2 = data.reduce((sum, d) => sum + d.value * d.value, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssRes = data.reduce((sum, d, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(d.value - predicted, 2);
    }, 0);
    const ssTot = data.reduce((sum, d) => sum + Math.pow(d.value - yMean, 2), 0);
    const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    return { slope, intercept, rSquared };
  }

  movingAverage(data: DataPoint[], window: number = 7): DataPoint[] {
    if (data.length < window) {
      return data;
    }

    const result: DataPoint[] = [];

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      const avg =
        windowData.reduce((sum, d) => sum + d.value, 0) / windowData.length;

      result.push({
        timestamp: data[i].timestamp,
        value: avg,
      });
    }

    return result;
  }

  exponentialSmoothing(
    data: DataPoint[],
    alpha: number = 0.3
  ): DataPoint[] {
    if (data.length === 0) return [];

    const result: DataPoint[] = [data[0]];

    for (let i = 1; i < data.length; i++) {
      const smoothed = alpha * data[i].value + (1 - alpha) * result[i - 1].value;
      result.push({
        timestamp: data[i].timestamp,
        value: smoothed,
      });
    }

    return result;
  }

  forecastLinear(
    data: DataPoint[],
    periodsAhead: number
  ): Prediction[] {
    const { slope, intercept, rSquared } = this.linearRegression(data);

    const predictions: Prediction[] = [];
    const lastIndex = data.length - 1;
    const lastTimestamp = data[lastIndex].timestamp;

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    for (let i = 1; i <= periodsAhead; i++) {
      const index = lastIndex + i;
      const predictedValue = slope * index + intercept;

      const confidence = Math.max(0.5, rSquared - i * 0.05);
      const errorMargin = std * (2 - confidence) * Math.sqrt(i);

      predictions.push({
        timestamp: lastTimestamp + i * 86400000,
        value: predictedValue,
        confidence,
        upperBound: predictedValue + errorMargin,
        lowerBound: predictedValue - errorMargin,
      });
    }

    return predictions;
  }

  analyzeTrend(data: DataPoint[]): TrendAnalysis {
    if (data.length < 2) {
      return {
        direction: 'stable',
        strength: 0,
        seasonality: false,
        volatility: 0,
      };
    }

    const { slope, rSquared } = this.linearRegression(data);

    const direction =
      Math.abs(slope) < 0.01 ? 'stable' : slope > 0 ? 'increasing' : 'decreasing';

    const strength = Math.min(1, Math.abs(rSquared));

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const volatility = mean === 0 ? 0 : Math.sqrt(variance) / mean;

    const seasonality = this.detectSeasonality(data);

    return {
      direction,
      strength,
      seasonality,
      volatility,
    };
  }

  private detectSeasonality(data: DataPoint[], period: number = 7): boolean {
    if (data.length < period * 2) {
      return false;
    }

    const autocorrelations: number[] = [];

    for (let lag = 1; lag <= period; lag++) {
      let sum = 0;
      let count = 0;

      for (let i = lag; i < data.length; i++) {
        sum += (data[i].value - data[i - lag].value) ** 2;
        count++;
      }

      const autocorr = count === 0 ? 0 : 1 - sum / (count * 2);
      autocorrelations.push(autocorr);
    }

    const avgAutocorr =
      autocorrelations.reduce((sum, a) => sum + a, 0) / autocorrelations.length;

    return avgAutocorr > 0.7;
  }

  detectAnomalies(
    data: DataPoint[],
    threshold: number = 3
  ): Array<{ index: number; value: number; zScore: number }> {
    if (data.length < 3) return [];

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    const anomalies: Array<{ index: number; value: number; zScore: number }> = [];

    values.forEach((value, index) => {
      const zScore = std === 0 ? 0 : Math.abs((value - mean) / std);

      if (zScore > threshold) {
        anomalies.push({ index, value, zScore });
      }
    });

    return anomalies;
  }

  calculateChurnRisk(
    lastActivityDays: number,
    totalSpend: number,
    engagementScore: number
  ): { risk: 'low' | 'medium' | 'high'; probability: number; factors: string[] } {
    const factors: string[] = [];
    let riskScore = 0;

    if (lastActivityDays > 30) {
      riskScore += 0.3;
      factors.push('Low recent activity');
    }

    if (lastActivityDays > 60) {
      riskScore += 0.2;
      factors.push('Extended inactivity');
    }

    if (totalSpend < 1000) {
      riskScore += 0.2;
      factors.push('Low financial commitment');
    }

    if (engagementScore < 0.3) {
      riskScore += 0.3;
      factors.push('Poor engagement');
    }

    const probability = Math.min(1, riskScore);
    const risk = probability < 0.3 ? 'low' : probability < 0.6 ? 'medium' : 'high';

    logger.info('Churn risk calculated', {
      lastActivityDays,
      totalSpend,
      engagementScore,
      risk,
      probability,
    });

    return { risk, probability, factors };
  }

  projectRevenue(
    historicalRevenue: DataPoint[],
    growthRate: number = 0.05,
    periodsAhead: number = 12
  ): Prediction[] {
    if (historicalRevenue.length === 0) {
      return [];
    }

    const predictions: Prediction[] = [];
    const lastValue = historicalRevenue[historicalRevenue.length - 1].value;
    const lastTimestamp = historicalRevenue[historicalRevenue.length - 1].timestamp;

    const trend = this.analyzeTrend(historicalRevenue);
    const adjustedGrowthRate = trend.direction === 'decreasing' ? -Math.abs(growthRate) : growthRate;

    for (let i = 1; i <= periodsAhead; i++) {
      const compoundGrowth = Math.pow(1 + adjustedGrowthRate, i);
      const predictedValue = lastValue * compoundGrowth;

      const confidence = Math.max(0.5, 1 - i * 0.03);
      const volatilityFactor = trend.volatility * i * 0.1;

      predictions.push({
        timestamp: lastTimestamp + i * 2592000000,
        value: predictedValue,
        confidence,
        upperBound: predictedValue * (1 + volatilityFactor),
        lowerBound: predictedValue * (1 - volatilityFactor),
      });
    }

    return predictions;
  }
}

export const mlEnhancedPredictionService = new MLEnhancedPredictionService();
