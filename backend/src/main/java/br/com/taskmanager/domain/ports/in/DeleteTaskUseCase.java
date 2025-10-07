package br.com.taskmanager.domain.ports.in;

import java.util.UUID;

/**
 * Porta de Entrada para exclusão de tarefa.
 */
public interface DeleteTaskUseCase {
    void deleteTask(UUID id);
}
