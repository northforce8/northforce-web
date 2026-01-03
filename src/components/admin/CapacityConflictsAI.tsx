/**
 * Capacity Conflicts AI Module
 *
 * Displays AI-detected capacity overloads and reallocation suggestions
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Users,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import type { CapacityConflict, RiskLevel } from '../../lib/ai-service';

interface CapacityConflictsAIProps {
  startDate: string;
  endDate: string;
  onRefresh?: () => void;
}

const CapacityConflictsAI: React.FC<CapacityConflictsAIProps> = ({ startDate, endDate, onRefresh }) => {
  const [conflicts, setConflicts] = useState<CapacityConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadConflicts();
  }, [startDate, endDate]);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      const data = await aiService.detectCapacityConflicts(startDate, endDate);
      setConflicts(data);
    } catch (error) {
      console.error('Error loading conflicts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: RiskLevel) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
          <h4 className="text-sm font-semibold text-gray-900">AI Conflict Detection</h4>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Scanning for conflicts...</p>
        </div>
      </div>
    );
  }

  if (conflicts.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg border border-green-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-full">
            <Users className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-900">No Conflicts Detected</h4>
            <p className="text-xs text-green-700 mt-1">
              All capacity allocations are within limits for the selected period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const criticalCount = conflicts.filter(c => c.severity === 'critical').length;
  const highCount = conflicts.filter(c => c.severity === 'high').length;
  const displayConflicts = showAll ? conflicts : conflicts.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-red-50 px-4 py-3 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                AI Conflict Detection
              </h4>
              <p className="text-xs text-gray-600">
                {conflicts.length} overallocation{conflicts.length !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {criticalCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                {criticalCount} Critical
              </span>
            )}
            {highCount > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                {highCount} High
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="p-4 space-y-3">
        {displayConflicts.map((conflict) => (
          <div
            key={conflict.conflict_id}
            className={`p-3 rounded-lg border-l-4 ${
              conflict.severity === 'critical'
                ? 'bg-red-50 border-red-500'
                : conflict.severity === 'high'
                ? 'bg-amber-50 border-amber-500'
                : 'bg-yellow-50 border-yellow-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">{conflict.partner_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{conflict.date}</span>
                </div>
                <p className="text-sm text-gray-700">{conflict.reasoning}</p>
                <div className="mt-2 flex items-center space-x-4 text-xs">
                  <div>
                    <span className="text-gray-500">Allocated:</span>
                    <span className="ml-1 font-semibold text-red-700">{conflict.allocated_hours.toFixed(1)}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Capacity:</span>
                    <span className="ml-1 font-semibold text-gray-700">{conflict.capacity_hours}h</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Overload:</span>
                    <span className="ml-1 font-semibold text-red-700">{conflict.overload_percentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ml-3 ${getSeverityColor(conflict.severity)}`}>
                {conflict.severity}
              </span>
            </div>

            {/* Actions */}
            {conflict.recommended_actions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                {conflict.recommended_actions.map((action) => (
                  <Link
                    key={action.action_id}
                    to={action.link || '#'}
                    className={`flex items-center justify-between p-2 rounded text-xs font-medium transition-colors ${
                      action.priority === 'critical'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    <span>{action.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Show More/Less */}
        {conflicts.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center space-x-2 text-xs text-amber-700 hover:text-amber-800 py-2 border-t border-gray-200"
          >
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showAll ? 'Show less' : `Show ${conflicts.length - 3} more conflicts`}</span>
          </button>
        )}

        {/* Refresh Button */}
        <button
          onClick={() => {
            loadConflicts();
            onRefresh?.();
          }}
          className="w-full mt-2 px-4 py-2 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default CapacityConflictsAI;
