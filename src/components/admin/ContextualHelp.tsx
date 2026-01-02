import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface ContextualHelpProps {
  title: string;
  purpose: string;
  usage: string[];
  concepts?: Array<{
    term: string;
    definition: string;
  }>;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  purpose,
  usage,
  concepts = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Purpose</h3>
                  <p className="text-sm text-gray-600">{purpose}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">How to Use</h3>
                  <ul className="space-y-2">
                    {usage.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {concepts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Concepts</h3>
                    <dl className="space-y-3">
                      {concepts.map((concept, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <dt className="text-sm font-medium text-gray-900 mb-1">
                            {concept.term}
                          </dt>
                          <dd className="text-sm text-gray-600">{concept.definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
