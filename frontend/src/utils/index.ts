/**
 * Format date to readable string
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time to readable string
 */
export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/**
 * Format date for input element
 */
export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Validate task title
 */
export const validateTitle = (title: string): string[] => {
  const errors: string[] = [];
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (title && title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  return errors;
};

/**
 * Validate due date
 */
export const validateDueDate = (dueDate: string | undefined): string[] => {
  const errors: string[] = [];
  if (dueDate && new Date(dueDate) <= new Date()) {
    errors.push('Due date must be in the future');
  }
  return errors;
};

/**
 * Generate pagination array
 */
export const generatePaginationArray = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const maxPages = 5;

  if (totalPages <= maxPages) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage > 2) {
      pages.push(0, '...');
    }
    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 3) {
      pages.push('...', totalPages - 1);
    }
  }

  return pages;
};

