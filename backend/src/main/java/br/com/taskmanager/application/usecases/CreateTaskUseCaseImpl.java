package br.com.taskmanager.application.usecases;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepositoryPort;
import org.springframework.stereotype.Service;

@Service
public class CreateTaskUseCaseImpl implements CreateTaskUseCase {

    private final TaskRepositoryPort taskRepositoryPort;

    public CreateTaskUseCaseImpl(TaskRepositoryPort taskRepositoryPort) {
        this.taskRepositoryPort = taskRepositoryPort;
    }

    @Override
    public Task createTask(Task task) {
        // A lógica de negócio para criar uma tarefa vai aqui.
        // Por exemplo, validações, regras, etc.
        // Neste caso, estamos apenas salvando a tarefa.
        return taskRepositoryPort.save(task);
    }
}