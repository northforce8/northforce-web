import React from 'react';
import { Calendar, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface TimelineItem {
  date: string;
  type: 'start' | 'milestone' | 'update' | 'completion' | 'deadline';
  title: string;
  description?: string;
  progress?: number;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

interface OKRTimelineProps {
  objective: {
    title: string;
    start_date: string;
    end_date: string;
    progress_percentage: number;
  };
  keyResults?: Array<{
    title: string;
    current_value: number;
    target_value: number;
    status: string;
  }>;
}

export function OKRTimeline({ objective, keyResults = [] }: OKRTimelineProps) {
  const generateTimelineItems = (): TimelineItem[] => {
    const items: TimelineItem[] = [];
    const startDate = new Date(objective.start_date);
    const endDate = new Date(objective.end_date);
    const today = new Date();

    items.push({
      date: objective.start_date,
      type: 'start',
      title: 'Objective Started',
      description: objective.title,
      status: 'info'
    });

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const milestone25 = new Date(startDate.getTime() + (totalDays * 0.25 * 24 * 60 * 60 * 1000));
    const milestone50 = new Date(startDate.getTime() + (totalDays * 0.5 * 24 * 60 * 60 * 1000));
    const milestone75 = new Date(startDate.getTime() + (totalDays * 0.75 * 24 * 60 * 60 * 1000));

    const addMilestone = (date: Date, percent: number) => {
      if (date <= today) {
        const status = objective.progress_percentage >= percent ? 'success' : 'danger';
        items.push({
          date: date.toISOString().split('T')[0],
          type: 'milestone',
          title: `${percent}% Milestone`,
          progress: percent,
          status
        });
      }
    };

    addMilestone(milestone25, 25);
    addMilestone(milestone50, 50);
    addMilestone(milestone75, 75);

    if (today >= endDate) {
      items.push({
        date: objective.end_date,
        type: objective.progress_percentage >= 100 ? 'completion' : 'deadline',
        title: objective.progress_percentage >= 100 ? 'Objective Completed' : 'Deadline Reached',
        progress: objective.progress_percentage,
        status: objective.progress_percentage >= 100 ? 'success' : 'danger'
      });
    } else {
      items.push({
        date: objective.end_date,
        type: 'deadline',
        title: 'Target Deadline',
        status: 'info'
      });
    }

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const timelineItems = generateTimelineItems();
  const today = new Date();
  const startDate = new Date(objective.start_date);
  const endDate = new Date(objective.end_date);
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const timeProgressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = (type: string, status?: string) => {
    switch (type) {
      case 'start':
        return <Target className="w-4 h-4" />;
      case 'milestone':
        return status === 'success' ? <TrendingUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;
      case 'completion':
        return <Target className="w-4 h-4" />;
      case 'deadline':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progress Timeline</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            Time Elapsed: <span className="font-semibold">{Math.round(timeProgressPercent)}%</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full" />
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${timeProgressPercent}%` }}
          />
          <div
            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full opacity-50 transition-all duration-500"
            style={{ width: `${objective.progress_percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{objective.start_date}</span>
          <span className="font-semibold text-gray-700">
            Progress: {objective.progress_percentage}% | Time: {Math.round(timeProgressPercent)}%
          </span>
          <span>{objective.end_date}</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {timelineItems.map((item, index) => {
            const isPast = new Date(item.date) <= today;
            return (
              <div key={index} className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)} text-white shadow-lg`}>
                  {getStatusIcon(item.type, item.status)}
                </div>
                <div className={`${isPast ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  {item.progress !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStatusColor(item.status)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{item.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {keyResults.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Results Status</h4>
          <div className="grid grid-cols-1 gap-2">
            {keyResults.map((kr, index) => {
              const progress = Math.min(100, (kr.current_value / kr.target_value) * 100);
              return (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    kr.status === 'on_track' ? 'bg-green-500' :
                    kr.status === 'at_risk' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="flex-1 text-gray-700">{kr.title}</span>
                  <span className="text-gray-600 font-medium">{Math.round(progress)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
