import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressDataPoint {
  date: string;
  progress: number;
  label?: string;
}

interface OKRProgressChartProps {
  objective: {
    title: string;
    progress_percentage: number;
    start_date: string;
    end_date: string;
  };
  historicalData?: ProgressDataPoint[];
}

export function OKRProgressChart({ objective, historicalData = [] }: OKRProgressChartProps) {
  const generateProgressData = (): ProgressDataPoint[] => {
    if (historicalData.length > 0) {
      return historicalData;
    }

    const startDate = new Date(objective.start_date);
    const endDate = new Date(objective.end_date);
    const today = new Date();

    const dataPoints: ProgressDataPoint[] = [];
    const daysDiff = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.min(12, Math.ceil(daysDiff / 7));

    for (let i = 0; i <= weeks; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i * 7));

      if (date > today) break;

      const progress = Math.min(objective.progress_percentage, (i / weeks) * objective.progress_percentage);

      dataPoints.push({
        date: date.toISOString().split('T')[0],
        progress: Math.round(progress),
        label: `Week ${i}`
      });
    }

    dataPoints.push({
      date: today.toISOString().split('T')[0],
      progress: objective.progress_percentage,
      label: 'Current'
    });

    return dataPoints;
  };

  const data = generateProgressData();
  const maxValue = 100;
  const chartHeight = 200;

  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'stable', value: 0 };

    const recent = data.slice(-3);
    const older = data.slice(-6, -3);

    if (recent.length === 0 || older.length === 0) return { direction: 'stable', value: 0 };

    const recentAvg = recent.reduce((sum, d) => sum + d.progress, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.progress, 0) / older.length;

    const diff = recentAvg - olderAvg;

    if (Math.abs(diff) < 2) return { direction: 'stable', value: 0 };
    return {
      direction: diff > 0 ? 'improving' : 'declining',
      value: Math.round(Math.abs(diff))
    };
  };

  const trend = calculateTrend();

  const startDate = new Date(objective.start_date);
  const endDate = new Date(objective.end_date);
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const expectedProgress = Math.min(100, (elapsedDays / totalDays) * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Progress Chart</h3>
          <p className="text-sm text-gray-600 mt-1">Tracking progress over time</p>
        </div>
        <div className="flex items-center gap-2">
          {trend.direction === 'improving' ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">+{trend.value}%</span>
            </div>
          ) : trend.direction === 'declining' ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-semibold">-{trend.value}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg">
              <Minus className="w-4 h-4" />
              <span className="text-sm font-semibold">Stable</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative" style={{ height: `${chartHeight}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="expectedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(156, 163, 175)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((value) => {
            const y = chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="-8"
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          {data.length > 1 && (
            <>
              <polyline
                points={data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = chartHeight - (d.progress / maxValue) * chartHeight;
                  return `${x}%,${y}`;
                }).join(' ')}
                fill="url(#progressGradient)"
                stroke="none"
              />

              <polyline
                points={data.map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = chartHeight - (d.progress / maxValue) * chartHeight;
                  return `${x}%,${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <line
                x1="0"
                y1={chartHeight - (expectedProgress / maxValue) * chartHeight}
                x2="100%"
                y2={chartHeight}
                stroke="rgb(156, 163, 175)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = chartHeight - (d.progress / maxValue) * chartHeight;
                return (
                  <g key={i}>
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="5"
                      fill="white"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="3"
                      fill="rgb(59, 130, 246)"
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Actual Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-400 border-dashed" style={{ borderTop: '2px dashed' }} />
            <span>Expected Progress</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-700 font-semibold">
            Current: {objective.progress_percentage}% | Expected: {Math.round(expectedProgress)}%
          </div>
          <div className={`text-xs mt-1 ${
            objective.progress_percentage >= expectedProgress ? 'text-green-600' : 'text-red-600'
          }`}>
            {objective.progress_percentage >= expectedProgress
              ? `${Math.round(objective.progress_percentage - expectedProgress)}% ahead`
              : `${Math.round(expectedProgress - objective.progress_percentage)}% behind`}
          </div>
        </div>
      </div>
    </div>
  );
}
