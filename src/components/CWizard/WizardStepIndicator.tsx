import React from 'react';
import { WizardStep } from './types';

interface WizardStepIndicatorProps {
  steps: WizardStep[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  steps,
  currentStepIndex,
  onStepClick
}) => {
  return (
    <div className="flex items-center w-full mb-4">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        
        return (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div 
              className={`relative flex items-center justify-center h-6 w-6 rounded-full text-xs 
                          ${isActive ? 'bg-blue-600 text-white' : 
                           isCompleted ? 'bg-green-500 text-white' : 
                           'bg-gray-200 text-gray-700'} 
                          ${onStepClick ? 'cursor-pointer' : ''}`}
              onClick={() => onStepClick && isCompleted && onStepClick(index)}
            >
              {isCompleted ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Step title */}
            <div className={`ml-2 text-xs ${isActive ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              {step.title}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WizardStepIndicator;
