package com.codebyte.taskmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * DTO for returning task data
 */
public class TaskResponseDto {

    private Integer id;

    private String title;

    private String description;

    private Boolean isCompleted;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    private String assignedTo;

    // Constructors
    public TaskResponseDto() {
    }

    public TaskResponseDto(Integer id, String title, String description, Boolean isCompleted,
                          LocalDateTime dueDate, LocalDateTime createdAt, LocalDateTime updatedAt, String assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.assignedTo = assignedTo;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    // Builder
    public static TaskResponseDtoBuilder builder() {
        return new TaskResponseDtoBuilder();
    }

    public static class TaskResponseDtoBuilder {
        private Integer id;
        private String title;
        private String description;
        private Boolean isCompleted;
        private LocalDateTime dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String assignedTo;

        public TaskResponseDtoBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public TaskResponseDtoBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TaskResponseDtoBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TaskResponseDtoBuilder isCompleted(Boolean isCompleted) {
            this.isCompleted = isCompleted;
            return this;
        }

        public TaskResponseDtoBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TaskResponseDtoBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TaskResponseDtoBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public TaskResponseDtoBuilder assignedTo(String assignedTo) {
            this.assignedTo = assignedTo;
            return this;
        }

        public TaskResponseDto build() {
            return new TaskResponseDto(id, title, description, isCompleted, dueDate, createdAt, updatedAt, assignedTo);
        }
    }
}

