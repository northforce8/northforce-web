/**
 * Contract Validation AI Module
 */

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import type { ContractValidation } from '../../lib/ai-service';

interface ContractValidationAIProps {
  contractId: string;
  onValidationComplete?: (canProgress: boolean) => void;
}

const ContractValidationAI: React.FC<ContractValidationAIProps> = ({ contractId, onValidationComplete }) => {
  const [validation, setValidation] = useState<ContractValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadValidation();
  }, [contractId]);

  const loadValidation = async () => {
    try {
      setLoading(true);
      const data = await aiService.validateContract(contractId);
      setValidation(data);
      onValidationComplete?.(data.can_progress);
    } catch (error) {
      console.error('Error validating contract:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!validation) return null;

  return (
    <div className={`rounded-lg border-2 overflow-hidden ${
      validation.can_progress
        ? 'bg-green-50 border-green-300'
        : validation.risk_level === 'critical' || validation.risk_level === 'high'
        ? 'bg-red-50 border-red-300'
        : 'bg-yellow-50 border-yellow-300'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className={`w-6 h-6 ${
            validation.can_progress ? 'text-green-600' : 'text-red-600'
          }`} />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">AI Compliance & Risk Check</h4>
            <p className="text-xs text-gray-600">
              Completeness: {validation.completeness_score}% | Risk: {validation.risk_level}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                validation.completeness_score >= 90
                  ? 'bg-green-500'
                  : validation.completeness_score >= 70
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${validation.completeness_score}%` }}
            />
          </div>
        </div>

        {validation.missing_fields.length > 0 && (
          <div className="mb-3 p-3 bg-red-100 rounded-lg border border-red-300">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              <span className="text-xs font-semibold text-red-900">Missing Fields:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {validation.missing_fields.map((field, index) => (
                <span key={index} className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}

        {validation.risk_flags.length > 0 && (
          <div className="mb-3 space-y-2">
            <h5 className="text-xs font-semibold text-gray-900">Risk Flags:</h5>
            {validation.risk_flags.map((flag, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  flag.severity === 'critical' || flag.severity === 'high'
                    ? 'bg-red-100 border border-red-300'
                    : 'bg-yellow-100 border border-yellow-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{flag.description}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    flag.severity === 'critical' ? 'bg-red-200 text-red-800' :
                    flag.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {flag.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {validation.recommended_actions.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-900">Required Actions:</h5>
            {validation.recommended_actions.map((action) => (
              <div key={action.action_id} className="p-2 bg-white rounded text-xs">
                <div className="font-medium text-gray-900">{action.title}</div>
                <div className="text-gray-600 mt-1">{action.description}</div>
              </div>
            ))}
          </div>
        )}

        {!validation.can_progress && (
          <div className="mt-3 p-3 bg-red-100 rounded-lg border-l-4 border-red-500">
            <div className="flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-red-700 mt-0.5" />
              <p className="text-xs text-red-800">
                <strong>Cannot progress:</strong> Critical issues must be resolved before contract can be signed or activated.
              </p>
            </div>
          </div>
        )}

        {validation.can_progress && (
          <div className="mt-3 p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5" />
              <p className="text-xs text-green-800">
                <strong>Ready to progress:</strong> Contract meets minimum requirements for advancement.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={loadValidation}
          className="w-full mt-3 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-white rounded-lg transition-colors"
        >
          Re-validate
        </button>
      </div>
    </div>
  );
};

export default ContractValidationAI;
