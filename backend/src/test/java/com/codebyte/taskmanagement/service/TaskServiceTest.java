package com.codebyte.taskmanagement.service;

import com.codebyte.taskmanagement.dto.PageDto;
import com.codebyte.taskmanagement.dto.TaskRequestDto;
import com.codebyte.taskmanagement.dto.TaskResponseDto;
import com.codebyte.taskmanagement.entity.Task;
import com.codebyte.taskmanagement.exception.TaskNotFoundException;
import com.codebyte.taskmanagement.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private TaskRequestDto requestDto;

    @BeforeEach
    void setUp() {
        task = Task.builder()
                .id(1)
                .title("Test Task")
                .description("Test Description")
                .isCompleted(false)
                .dueDate(LocalDateTime.now().plusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .assignedTo("John")
                .build();

        requestDto = new TaskRequestDto();
        requestDto.setTitle("Test Task");
        requestDto.setDescription("Test Description");
        requestDto.setIsCompleted(false);
        requestDto.setAssignedTo("John");
    }

    @Test
    void createTask_shouldSaveAndReturnTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDto result = taskService.createTask(requestDto);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        assertFalse(result.getIsCompleted());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getTaskById_whenExists_shouldReturnTask() {
        when(taskRepository.findById(1)).thenReturn(Optional.of(task));

        TaskResponseDto result = taskService.getTaskById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void getTaskById_whenNotFound_shouldThrowException() {
        when(taskRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(99));
    }

    @Test
    void updateTask_whenExists_shouldUpdateAndReturn() {
        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        requestDto.setTitle("Updated Title");
        TaskResponseDto result = taskService.updateTask(1, requestDto);

        assertNotNull(result);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void deleteTask_whenExists_shouldDelete() {
        when(taskRepository.existsById(1)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1);

        assertDoesNotThrow(() -> taskService.deleteTask(1));
        verify(taskRepository).deleteById(1);
    }

    @Test
    void deleteTask_whenNotFound_shouldThrowException() {
        when(taskRepository.existsById(99)).thenReturn(false);

        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(99));
        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    void toggleTaskStatus_shouldFlipCompletionStatus() {
        task.setIsCompleted(false);
        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponseDto result = taskService.toggleTaskStatus(1);

        assertTrue(result.getIsCompleted());
    }

    @Test
    void getAllTasks_shouldReturnPagedResults() {
        Page<Task> page = new PageImpl<>(List.of(task), Pageable.ofSize(10), 1);
        when(taskRepository.findAll(any(Pageable.class))).thenReturn(page);

        PageDto<TaskResponseDto> result = taskService.getAllTasks(0, 10, "id", "ASC");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(1, result.getTotalElements());
    }
}

