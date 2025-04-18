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
  validate?: () => ValidationResult | boolean | Promise<ValidationResult | boolean>;
}

export interface WizardStepComponentProps {
  stepIndex: number;
  totalSteps: number;
  validate?: () => boolean | Promise<boolean>;
}

export interface CWizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel: () => void;
  loading?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  completeLabel?: string;
  cancelLabel?: string;
  className?: string;
}
