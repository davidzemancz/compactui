import React from 'react';

// Type for validation result
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validate?: (stepData: any) => ValidationResult | boolean | Promise<ValidationResult | boolean>;
}

export interface WizardStepComponentProps {
  formData: any;
  updateFormData: (data: any) => void;
  stepIndex: number;
  totalSteps: number;
}

export interface CWizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  loading?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  completeLabel?: string;
  cancelLabel?: string;
  className?: string;
}
