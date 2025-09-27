package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;

public interface CreateTaskUseCase {
    Task createTask(Task task);
}