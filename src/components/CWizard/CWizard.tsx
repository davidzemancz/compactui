import React, { useState } from 'react';
import WizardStepIndicator from './WizardStepIndicator';
import { CWizardProps } from './types';

const CWizard: React.FC<CWizardProps> = ({
  steps,
  onComplete,
  onCancel,
  loading = false,
  nextLabel = 'Další',
  prevLabel = 'Zpět',
  completeLabel = 'Dokončit',
  cancelLabel = 'Zrušit',
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  
  // Handle moving to the next step
  const handleNext = async () => {
    // If the current step has a validation function, call it
    if (currentStep.validate) {
      setIsValidating(true);
      try {
        // Call the validate function without passing any data
        const validationResult = await currentStep.validate();
        
        // Handle boolean or ValidationResult
        let isValid = false;
        if (typeof validationResult === 'boolean') {
          isValid = validationResult;
        } else {
          isValid = validationResult.valid;
          
          // If validation failed with a message, you could display it here
          if (!isValid && validationResult.message) {
            console.warn(`Validation failed: ${validationResult.message}`);
          }
        }
        
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        console.error('Step validation error:', error);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };
  
  // Handle moving to the previous step
  const handlePrevious = () => {
    setCurrentStepIndex(prevIndex => Math.max(0, prevIndex - 1));
  };
  
  // Handle clicking on a completed step to go back
  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setCurrentStepIndex(index);
    }
  };
  
  // Render the current step with stepIndex and totalSteps
  const renderCurrentStep = () => {
    if (!currentStep) return null;
    
    // Use a more compatible approach for passing props to step components
    const stepWithProps = React.isValidElement(currentStep.component)
      ? React.cloneElement(currentStep.component, {
          
        })
      : currentStep.component;

    return stepWithProps;
  };
  
  return (
    <div className={`bg-white rounded shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <WizardStepIndicator 
          steps={steps} 
          currentStepIndex={currentStepIndex} 
          onStepClick={handleStepClick}
        />
        
        {currentStep.description && (
          <p className="mt-2 text-xs text-gray-600">
            {currentStep.description}
          </p>
        )}
      </div>
      
      <div className="p-4">
        {renderCurrentStep()}
      </div>
      
      <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-200">
        <div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-gray-700 text-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
        
        <div className="flex space-x-2">
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={loading || isValidating}
              className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-gray-700 text-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {prevLabel}
            </button>
          )}
          
          <button
            type="button"
            onClick={handleNext}
            disabled={loading || isValidating}
            className="px-3 py-1 bg-blue-600 border border-transparent rounded shadow-sm text-white text-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLastStep ? completeLabel : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CWizard;
