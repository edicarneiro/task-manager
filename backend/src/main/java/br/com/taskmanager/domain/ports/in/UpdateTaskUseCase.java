package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;

import java.util.UUID;

/**
 * Porta de Entrada para atualização de tarefa.
 */
public interface UpdateTaskUseCase {
    Task updateTask(UUID id, Task task);
}
