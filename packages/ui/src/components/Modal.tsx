import React from 'react';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, className, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-lg bg-white shadow-lg',
            className
          )}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';
