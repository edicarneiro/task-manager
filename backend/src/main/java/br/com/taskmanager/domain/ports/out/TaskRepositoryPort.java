package br.com.taskmanager.domain.ports.out;

import br.com.taskmanager.domain.Task;

public interface TaskRepositoryPort {
    Task save(Task task);
}