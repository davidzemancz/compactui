import React from 'react';
import CDrawer from '../CDrawer';
import CForm from '../CForm/CForm';
import { FormField } from '../CForm/types';

export interface CDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fields: FormField[];
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  width?: string | number;
  position?: 'left' | 'right';
  closeOnClickOutside?: boolean;
  footerContent?: React.ReactNode;
}

const CDrawerForm: React.FC<CDrawerFormProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  width = '500px',
  position = 'right',
  closeOnClickOutside = false,
  footerContent,
}) => {
  // Handle form cancellation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <CDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      position={position}
      closeOnClickOutside={closeOnClickOutside}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <CForm
            fields={fields}
            onSubmit={onSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            className="border-0 shadow-none"
          />
        </div>
        
        {footerContent && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            {footerContent}
          </div>
        )}
      </div>
    </CDrawer>
  );
};

export default CDrawerForm;
