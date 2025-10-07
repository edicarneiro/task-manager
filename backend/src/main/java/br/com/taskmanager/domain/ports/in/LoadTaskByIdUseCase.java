package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;

import java.util.Optional;
import java.util.UUID;

/**
 * Porta de Entrada para carregar uma tarefa por ID.
 */
public interface LoadTaskByIdUseCase {
    Optional<Task> loadById(UUID id);
}
