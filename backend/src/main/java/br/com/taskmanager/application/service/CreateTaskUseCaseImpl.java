package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * [APLICAÇÃO] - Implementação do caso de uso CreateTaskUseCase.
 * Lógica de negócio: garante que a Task tenha ID, data de criação e estado inicial.
 */
@Service
public class CreateTaskUseCaseImpl implements CreateTaskUseCase {

    private final TaskRepository taskRepository;

    public CreateTaskUseCaseImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task createTask(Task task) {
        if (task.getId() == null) {
            task.setId(UUID.randomUUID());
        }
        
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("pendente");
        }
        
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDateTime.now());
        }
        
        return taskRepository.save(task);
    }
}