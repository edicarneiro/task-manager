package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.LoadTaskByIdUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * [APLICAÇÃO] - Implementação do caso de uso para carregar tarefa por ID.
 */
@Service
public class LoadTaskByIdUseCaseImpl implements LoadTaskByIdUseCase {

    private final TaskRepository taskRepository;

    public LoadTaskByIdUseCaseImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Optional<Task> loadById(UUID id) {
        return taskRepository.findById(id);
    }
}
