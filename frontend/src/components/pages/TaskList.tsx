import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import { ErrorAlert, SuccessAlert, LoadingSpinner, Pagination } from '../common/Alert';
import { formatDate, isOverdue } from '../../utils';
import './TaskList.css';

export const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks, loading, error, pageInfo,
    fetchTasks, fetchTasksByStatus, searchTasks,
    toggleTaskStatus, deleteTask, clearError,
  } = useTaskContext();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'dueDate'>('id');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const buildParams = useCallback(
    (page = 0) => ({ page, size: 10, sortBy, sortDirection }),
    [sortBy, sortDirection]
  );

  const loadTasks = useCallback(
    async (page = 0) => {
      if (searchTerm) {
        await searchTasks(searchTerm, buildParams(page));
      } else if (filterStatus === 'completed') {
        await fetchTasksByStatus(true, buildParams(page));
      } else if (filterStatus === 'pending') {
        await fetchTasksByStatus(false, buildParams(page));
      } else {
        await fetchTasks(buildParams(page));
      }
    },
    [searchTerm, filterStatus, buildParams, fetchTasks, fetchTasksByStatus, searchTasks]
  );

  // Reload whenever filter/sort/search changes
  useEffect(() => {
    loadTasks(0);
  }, [filterStatus, sortBy, sortDirection, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setFilterStatus('all');
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleSortChange = (field: 'id' | 'title' | 'dueDate') => {
    if (sortBy === field) {
      setSortDirection(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortDirection('ASC');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleTaskStatus(id);
      setSuccessMessage('Task status updated');
    } catch {
      // error handled in context
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setSuccessMessage('Task deleted successfully');
      } catch {
        // error handled in context
      }
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Task Manager</h1>
        <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
          + New Task
        </button>
      </div>

      {error && <ErrorAlert message={error} onClose={clearError} />}
      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      <div className="task-controls">
        {/* Search */}
        <form className="search-group" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            aria-label="Search tasks"
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          {searchTerm && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        {/* Filter */}
        <div className="filter-group">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            className="select"
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value as any);
              setSearchTerm('');
              setSearchInput('');
            }}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Sort */}
        <div className="sort-group">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            className="select"
            value={sortBy}
            onChange={e => handleSortChange(e.target.value as any)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
          </select>
          <button
            className="sort-direction-btn"
            onClick={() => setSortDirection(prev => (prev === 'ASC' ? 'DESC' : 'ASC'))}
            aria-label={`Sort direction: ${sortDirection}`}
          >
            {sortDirection === 'ASC' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. {searchTerm ? 'Try a different search.' : 'Create one to get started!'}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
              Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="task-table-container">
            <table className="task-table" role="table">
              <thead>
                <tr>
                  <th>
                    <button className="sort-header" onClick={() => handleSortChange('title')}>
                      Title {sortBy === 'title' && (sortDirection === 'ASC' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th>Status</th>
                  <th>
                    <button className="sort-header" onClick={() => handleSortChange('dueDate')}>
                      Due Date {sortBy === 'dueDate' && (sortDirection === 'ASC' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className={task.isCompleted ? 'completed' : ''}>
                    <td className="task-title">{task.title}</td>
                    <td>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleToggleStatus(task.id)}
                          aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
                        />
                        <span className="status-badge">
                          {task.isCompleted ? '✓ Done' : 'Pending'}
                        </span>
                      </label>
                    </td>
                    <td className={isOverdue(task.dueDate) && !task.isCompleted ? 'overdue' : ''}>
                      {formatDate(task.dueDate)}
                    </td>
                    <td>{task.assignedTo || 'Unassigned'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          aria-label={`Edit ${task.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(task.id)}
                          aria-label={`Delete ${task.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-info-bar">
            Showing {tasks.length} of {pageInfo.totalElements} tasks
          </div>

          <Pagination
            currentPage={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            hasNext={pageInfo.hasNext}
            hasPrevious={pageInfo.hasPrevious}
            onPageChange={page => loadTasks(page)}
          />
        </>
      )}
    </div>
  );
};

