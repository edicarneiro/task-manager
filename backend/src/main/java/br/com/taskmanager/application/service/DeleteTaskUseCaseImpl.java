package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.ports.in.DeleteTaskUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * [APLICAÇÃO] - Implementação do caso de uso de exclusão de tarefa.
 */
@Service
public class DeleteTaskUseCaseImpl implements DeleteTaskUseCase {

    private final TaskRepository taskRepository;

    public DeleteTaskUseCaseImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
}
