package com.codebyte.taskmanagement.controller;

import com.codebyte.taskmanagement.dto.PageDto;
import com.codebyte.taskmanagement.dto.TaskRequestDto;
import com.codebyte.taskmanagement.dto.TaskResponseDto;
import com.codebyte.taskmanagement.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for Task management
 */
@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "Task Management API endpoints")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Get all tasks with pagination and sorting
     */
    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieve all tasks with pagination and sorting options")
    public ResponseEntity<PageDto<TaskResponseDto>> getAllTasks(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        System.out.println("GET /api/v1/tasks - Fetching all tasks");
        return ResponseEntity.ok(taskService.getAllTasks(page, size, sortBy, sortDirection));
    }

    /**
     * Get tasks filtered by completion status
     */
    @GetMapping("/status")
    @Operation(summary = "Get tasks by status", description = "Retrieve tasks filtered by completion status")
    public ResponseEntity<PageDto<TaskResponseDto>> getTasksByStatus(
            @Parameter(description = "Completion status")
            @RequestParam Boolean isCompleted,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        System.out.println("GET /api/v1/tasks/status - Fetching tasks with status: " + isCompleted);
        return ResponseEntity.ok(taskService.getTasksByStatus(isCompleted, page, size, sortBy, sortDirection));
    }

    /**
     * Search tasks by title
     */
    @GetMapping("/search")
    @Operation(summary = "Search tasks by title", description = "Search tasks by title (partial match)")
    public ResponseEntity<PageDto<TaskResponseDto>> searchTasksByTitle(
            @Parameter(description = "Search keyword")
            @RequestParam String title,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        System.out.println("GET /api/v1/tasks/search - Searching tasks with title: " + title);
        return ResponseEntity.ok(taskService.searchTasksByTitle(title, page, size, sortBy, sortDirection));
    }

    /**
     * Get tasks by due date range
     */
    @GetMapping("/due-date-range")
    @Operation(summary = "Get tasks by due date range", description = "Retrieve tasks within a specific due date range")
    public ResponseEntity<PageDto<TaskResponseDto>> getTasksByDueDateRange(
            @Parameter(description = "Start date (ISO format)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @Parameter(description = "End date (ISO format)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort by field")
            @RequestParam(defaultValue = "dueDate") String sortBy,

            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        System.out.println("GET /api/v1/tasks/due-date-range - Fetching tasks between " + startDate + " and " + endDate);
        return ResponseEntity.ok(taskService.getTasksByDueDateRange(startDate, endDate, page, size, sortBy, sortDirection));
    }

    /**
     * Get a single task by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieve a specific task by its ID")
    public ResponseEntity<TaskResponseDto> getTaskById(
            @Parameter(description = "Task ID")
            @PathVariable Integer id) {

        System.out.println("GET /api/v1/tasks/{" + id + "} - Fetching task");
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    /**
     * Create a new task
     */
    @PostMapping
    @Operation(summary = "Create task", description = "Create a new task")
    public ResponseEntity<TaskResponseDto> createTask(
            @Valid @RequestBody TaskRequestDto taskRequestDto) {

        System.out.println("POST /api/v1/tasks - Creating new task");
        TaskResponseDto createdTask = taskService.createTask(taskRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    /**
     * Update an existing task
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Update an existing task")
    public ResponseEntity<TaskResponseDto> updateTask(
            @Parameter(description = "Task ID")
            @PathVariable Integer id,

            @Valid @RequestBody TaskRequestDto taskRequestDto) {

        System.out.println("PUT /api/v1/tasks/{" + id + "} - Updating task");
        return ResponseEntity.ok(taskService.updateTask(id, taskRequestDto));
    }

    /**
     * Toggle task completion status
     */
    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle task status", description = "Toggle the completion status of a task")
    public ResponseEntity<TaskResponseDto> toggleTaskStatus(
            @Parameter(description = "Task ID")
            @PathVariable Integer id) {

        System.out.println("PATCH /api/v1/tasks/{" + id + "}/toggle-status - Toggling task status");
        return ResponseEntity.ok(taskService.toggleTaskStatus(id));
    }

    /**
     * Delete a task
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Delete a task by its ID")
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "Task ID")
            @PathVariable Integer id) {

        System.out.println("DELETE /api/v1/tasks/{" + id + "} - Deleting task");
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}

