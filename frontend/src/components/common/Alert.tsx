import React from 'react';
import './styles.css';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="alert alert-error" role="alert">
      <div className="alert-content">
        <span className="alert-icon">⚠️</span>
        <span className="alert-message">{message}</span>
      </div>
      <button className="alert-close" onClick={onClose} aria-label="Close alert">
        ✕
      </button>
    </div>
  );
};

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert alert-success" role="alert">
      <div className="alert-content">
        <span className="alert-icon">✓</span>
        <span className="alert-message">{message}</span>
      </div>
      <button className="alert-close" onClick={onClose} aria-label="Close alert">
        ✕
      </button>
    </div>
  );
};

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) => {
  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

