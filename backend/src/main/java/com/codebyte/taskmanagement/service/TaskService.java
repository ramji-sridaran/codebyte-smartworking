package com.codebyte.taskmanagement.service;

import com.codebyte.taskmanagement.dto.PageDto;
import com.codebyte.taskmanagement.dto.TaskRequestDto;
import com.codebyte.taskmanagement.dto.TaskResponseDto;
import com.codebyte.taskmanagement.entity.Task;
import com.codebyte.taskmanagement.exception.TaskNotFoundException;
import com.codebyte.taskmanagement.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service layer for task management business logic
 */
@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Get all tasks with pagination and sorting
     */
    public PageDto<TaskResponseDto> getAllTasks(int page, int size, String sortBy, String sortDirection) {
        System.out.println("DEBUG: Fetching all tasks - page: " + page + ", size: " + size + ", sortBy: " + sortBy + ", direction: " + sortDirection);

        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Task> taskPage = taskRepository.findAll(pageable);
        return convertToPageDto(taskPage, page, size);
    }

    /**
     * Get tasks filtered by completion status
     */
    public PageDto<TaskResponseDto> getTasksByStatus(Boolean isCompleted, int page, int size, String sortBy, String sortDirection) {
        System.out.println("DEBUG: Fetching tasks by status - isCompleted: " + isCompleted + ", page: " + page + ", size: " + size);

        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Task> taskPage = taskRepository.findByIsCompleted(isCompleted, pageable);
        return convertToPageDto(taskPage, page, size);
    }

    /**
     * Get tasks filtered by title
     */
    public PageDto<TaskResponseDto> searchTasksByTitle(String title, int page, int size, String sortBy, String sortDirection) {
        System.out.println("DEBUG: Searching tasks by title - title: " + title + ", page: " + page + ", size: " + size);

        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Task> taskPage = taskRepository.findByTitleIgnoreCaseContaining(title, pageable);
        return convertToPageDto(taskPage, page, size);
    }

    /**
     * Get tasks filtered by due date range
     */
    public PageDto<TaskResponseDto> getTasksByDueDateRange(LocalDateTime startDate, LocalDateTime endDate,
                                                            int page, int size, String sortBy, String sortDirection) {
        System.out.println("DEBUG: Fetching tasks by due date range - start: " + startDate + ", end: " + endDate + ", page: " + page);

        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Task> taskPage = taskRepository.findTasksByDueDateRange(startDate, endDate, pageable);
        return convertToPageDto(taskPage, page, size);
    }

    /**
     * Get a single task by ID
     */
    public TaskResponseDto getTaskById(Integer id) {
        System.out.println("DEBUG: Fetching task with id: " + id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("WARN: Task not found with id: " + id);
                    return new TaskNotFoundException("Task not found with id: " + id);
                });

        return convertToResponseDto(task);
    }

    /**
     * Create a new task
     */
    public TaskResponseDto createTask(TaskRequestDto taskRequestDto) {
        System.out.println("DEBUG: Creating new task with title: " + taskRequestDto.getTitle());

        Task task = Task.builder()
                .title(taskRequestDto.getTitle())
                .description(taskRequestDto.getDescription())
                .isCompleted(taskRequestDto.getIsCompleted() != null ? taskRequestDto.getIsCompleted() : false)
                .dueDate(taskRequestDto.getDueDate())
                .assignedTo(taskRequestDto.getAssignedTo())
                .build();

        Task savedTask = taskRepository.save(task);
        System.out.println("INFO: Task created successfully with id: " + savedTask.getId());

        return convertToResponseDto(savedTask);
    }

    /**
     * Update an existing task
     */
    public TaskResponseDto updateTask(Integer id, TaskRequestDto taskRequestDto) {
        System.out.println("DEBUG: Updating task with id: " + id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("WARN: Task not found with id: " + id);
                    return new TaskNotFoundException("Task not found with id: " + id);
                });

        task.setTitle(taskRequestDto.getTitle());
        task.setDescription(taskRequestDto.getDescription());
        task.setIsCompleted(taskRequestDto.getIsCompleted());
        task.setDueDate(taskRequestDto.getDueDate());
        task.setAssignedTo(taskRequestDto.getAssignedTo());

        Task updatedTask = taskRepository.save(task);
        System.out.println("INFO: Task updated successfully with id: " + updatedTask.getId());

        return convertToResponseDto(updatedTask);
    }

    /**
     * Delete a task
     */
    public void deleteTask(Integer id) {
        System.out.println("DEBUG: Deleting task with id: " + id);

        if (!taskRepository.existsById(id)) {
            System.out.println("WARN: Task not found with id: " + id);
            throw new TaskNotFoundException("Task not found with id: " + id);
        }

        taskRepository.deleteById(id);
        System.out.println("INFO: Task deleted successfully with id: " + id);
    }

    /**
     * Toggle task completion status
     */
    public TaskResponseDto toggleTaskStatus(Integer id) {
        System.out.println("DEBUG: Toggling completion status for task with id: " + id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("WARN: Task not found with id: " + id);
                    return new TaskNotFoundException("Task not found with id: " + id);
                });

        task.setIsCompleted(!task.getIsCompleted());
        Task updatedTask = taskRepository.save(task);
        System.out.println("INFO: Task status toggled successfully for id: " + updatedTask.getId());

        return convertToResponseDto(updatedTask);
    }

    /**
     * Convert Task entity to TaskResponseDto
     */
    private TaskResponseDto convertToResponseDto(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .isCompleted(task.getIsCompleted())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .assignedTo(task.getAssignedTo())
                .build();
    }

    /**
     * Convert Page<Task> to PageDto<TaskResponseDto>
     */
    private PageDto<TaskResponseDto> convertToPageDto(Page<Task> taskPage, int page, int size) {
        return PageDto.<TaskResponseDto>builder()
                .content(taskPage.getContent().stream()
                        .map(this::convertToResponseDto)
                        .toList())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .currentPage(page)
                .pageSize(size)
                .hasNext(taskPage.hasNext())
                .hasPrevious(taskPage.hasPrevious())
                .build();
    }
}

