/**
 * Invoice Validation AI Module
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import type { InvoiceValidation } from '../../lib/ai-service';

interface InvoiceValidationAIProps {
  invoiceId: string;
  onValidationComplete?: (canSend: boolean) => void;
}

const InvoiceValidationAI: React.FC<InvoiceValidationAIProps> = ({ invoiceId, onValidationComplete }) => {
  const [validation, setValidation] = useState<InvoiceValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadValidation();
  }, [invoiceId]);

  const loadValidation = async () => {
    try {
      setLoading(true);
      const data = await aiService.validateInvoice(invoiceId);
      setValidation(data);
      onValidationComplete?.(data.can_send);
    } catch (error) {
      console.error('Error validating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!validation) return null;

  const getStatusIcon = () => {
    if (validation.can_send) {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    } else if (validation.risk_level === 'critical' || validation.risk_level === 'high') {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }
    return <AlertTriangle className="w-6 h-6 text-orange-600" />;
  };

  return (
    <div className={`rounded-lg border-2 overflow-hidden ${
      validation.can_send
        ? 'bg-green-50 border-green-300'
        : validation.risk_level === 'critical' || validation.risk_level === 'high'
        ? 'bg-red-50 border-red-300'
        : 'bg-orange-50 border-orange-300'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          {getStatusIcon()}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">AI Invoice Validation</h4>
            <p className="text-xs text-gray-600">
              {validation.can_send ? 'Ready to send' : 'Issues detected - review required'}
            </p>
          </div>
        </div>

        {/* Checks Summary */}
        <div className="space-y-2 mb-3">
          {validation.checks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded text-xs ${
                check.passed ? 'bg-white bg-opacity-50' : 'bg-red-100'
              }`}
            >
              <span className="flex items-center space-x-2">
                {check.passed ? (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span className="font-medium">{check.check_name}</span>
              </span>
              {!check.passed && check.deviation_percentage && (
                <span className="text-red-700 font-semibold">
                  {check.deviation_percentage.toFixed(1)}% deviation
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Anomalies */}
        {validation.anomalies.length > 0 && (
          <div className="mb-3 p-3 bg-red-100 rounded-lg border border-red-300">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              <span className="text-xs font-semibold text-red-900">
                {validation.anomalies.length} Anomal{validation.anomalies.length > 1 ? 'ies' : 'y'} Detected
              </span>
            </div>
            {validation.anomalies.map((anomaly, index) => (
              <p key={index} className="text-xs text-red-800 mb-1">• {anomaly.description}</p>
            ))}
          </div>
        )}

        {/* Corrections */}
        {validation.recommended_corrections.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-900">Recommended Corrections:</h5>
            {validation.recommended_corrections.map((action) => (
              <div key={action.action_id} className="p-2 bg-white rounded text-xs">
                <div className="font-medium text-gray-900">{action.title}</div>
                <div className="text-gray-600 mt-1">{action.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center space-x-2 text-xs text-gray-700 hover:text-gray-900 py-2 mt-3 border-t border-gray-300"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showDetails ? 'Hide' : 'Show'} validation details</span>
        </button>

        {showDetails && (
          <div className="mt-3 space-y-2">
            {validation.checks.map((check, index) => (
              <div key={index} className="text-xs bg-white p-2 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{check.check_name}</span>
                  <span className={check.passed ? 'text-green-600' : 'text-red-600'}>
                    {check.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Expected: {String(check.expected_value)}</span>
                  <span>Actual: {String(check.actual_value)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceValidationAI;
