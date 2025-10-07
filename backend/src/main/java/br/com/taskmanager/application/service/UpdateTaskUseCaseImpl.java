package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.UpdateTaskUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * [APLICAÇÃO] - Implementação do caso de uso de atualização de tarefa.
 */
@Service
public class UpdateTaskUseCaseImpl implements UpdateTaskUseCase {

    private final TaskRepository taskRepository;

    public UpdateTaskUseCaseImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task updateTask(UUID id, Task task) {
        task.setId(id);
        // Poderíamos adicionar regras de negócio aqui (ex: validações de status)
        return taskRepository.save(task);
    }
}
