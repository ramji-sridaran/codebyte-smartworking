package com.codebyte.taskmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * DTO for creating or updating tasks
 */
public class TaskRequestDto {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;

    private String description;

    private Boolean isCompleted = false;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    private String assignedTo;

    // Constructors
    public TaskRequestDto() {
    }

    public TaskRequestDto(String title, String description, Boolean isCompleted, LocalDateTime dueDate, String assignedTo) {
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    // Builder
    public static TaskRequestDtoBuilder builder() {
        return new TaskRequestDtoBuilder();
    }

    public static class TaskRequestDtoBuilder {
        private String title;
        private String description;
        private Boolean isCompleted = false;
        private LocalDateTime dueDate;
        private String assignedTo;

        public TaskRequestDtoBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TaskRequestDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TaskRequestDtoBuilder isCompleted(Boolean isCompleted) {
            this.isCompleted = isCompleted;
            return this;
        }

        public TaskRequestDtoBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TaskRequestDtoBuilder assignedTo(String assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public TaskRequestDto build() {
            return new TaskRequestDto(title, description, isCompleted, dueDate, assignedTo);
        }
    }
}

