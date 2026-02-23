package com.codebyte.taskmanagement.repository;

import com.codebyte.taskmanagement.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * Repository for Task entity
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    /**
     * Find tasks by completion status
     */
    Page<Task> findByIsCompleted(Boolean isCompleted, Pageable pageable);

    /**
     * Find tasks by title (partial match)
     */
    Page<Task> findByTitleIgnoreCaseContaining(String title, Pageable pageable);

    /**
     * Find tasks with due date in a range
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startDate AND :endDate ORDER BY t.dueDate ASC")
    Page<Task> findTasksByDueDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    /**
     * Find tasks by assigned person
     */
    Page<Task> findByAssignedToIgnoreCaseContaining(String assignedTo, Pageable pageable);
}

