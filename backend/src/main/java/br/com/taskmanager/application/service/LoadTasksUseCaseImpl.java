package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.LoadTasksUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * [APLICAÇÃO] - Implementação do caso de uso LoadTasksUseCase.
 * Responsável por carregar todas as tarefas existentes.
 */
@Service
public class LoadTasksUseCaseImpl implements LoadTasksUseCase {

    private final TaskRepository taskRepository;

    public LoadTasksUseCaseImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> loadAllTasks() {
        return taskRepository.findAll();
    }
}