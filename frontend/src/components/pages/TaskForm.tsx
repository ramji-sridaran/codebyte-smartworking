import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import { ErrorAlert, SuccessAlert, LoadingSpinner } from '../common/Alert';
import { formatDateForInput, validateTitle, validateDueDate } from '../../utils';
import { taskService } from '../../services/taskService';
import { Task } from '../../types';
import './TaskForm.css';

export const TaskForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { createTask, updateTask, error, clearError } = useTaskContext();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    isCompleted: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadTask(parseInt(id, 10));
    }
  }, [id, isEditMode]);

  const loadTask = async (taskId: number) => {
    setLoading(true);
    try {
      const task: Task = await taskService.getTaskById(taskId);
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formatDateForInput(task.dueDate),
        assignedTo: task.assignedTo || '',
        isCompleted: task.isCompleted,
      });
    } catch (err) {
      setSubmitError('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string[]> = {};

    const titleErrors = validateTitle(formData.title);
    if (titleErrors.length > 0) {
      errors.title = titleErrors;
    }

    const dueDateErrors = validateDueDate(formData.dueDate);
    if (dueDateErrors.length > 0) {
      errors.dueDate = dueDateErrors;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);
    clearError();

    try {
      // Format date to yyyy-MM-dd'T'HH:mm:ss as expected by the backend
      const formatDueDate = (date: string) =>
        date ? new Date(date).toISOString().split('.')[0] : undefined;

      if (isEditMode && id) {
        await updateTask(parseInt(id, 10), {
          title: formData.title,
          description: formData.description,
          dueDate: formatDueDate(formData.dueDate),
          assignedTo: formData.assignedTo,
          isCompleted: formData.isCompleted,
        });
        setSuccess('Task updated successfully');
      } else {
        await createTask({
          title: formData.title,
          description: formData.description,
          dueDate: formatDueDate(formData.dueDate),
          assignedTo: formData.assignedTo,
          isCompleted: formData.isCompleted,
        });
        setSuccess('Task created successfully');
      }

      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (err) {
      setSubmitError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  if (loading && isEditMode) {
    return <LoadingSpinner message="Loading task..." />;
  }

  return (
    <div className="task-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate('/tasks')} aria-label="Go back">
          ← Back
        </button>
        <h1>{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
      </div>

      {error && <ErrorAlert message={error} onClose={clearError} />}
      {submitError && <ErrorAlert message={submitError} onClose={() => setSubmitError(null)} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="form-group">
          <label htmlFor="title">
            Task Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            maxLength={100}
            className={validationErrors.title ? 'input-error' : ''}
            aria-invalid={!!validationErrors.title}
            aria-describedby={validationErrors.title ? 'title-error' : undefined}
            required
          />
          {validationErrors.title && (
            <div id="title-error" className="error-message">
              {validationErrors.title.join(', ')}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={validationErrors.dueDate ? 'input-error' : ''}
              aria-invalid={!!validationErrors.dueDate}
              aria-describedby={validationErrors.dueDate ? 'dueDate-error' : undefined}
            />
            {validationErrors.dueDate && (
              <div id="dueDate-error" className="error-message">
                {validationErrors.dueDate.join(', ')}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter assignee name"
              maxLength={100}
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="isCompleted" className="checkbox-label">
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
            />
            <span>Mark as completed</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

