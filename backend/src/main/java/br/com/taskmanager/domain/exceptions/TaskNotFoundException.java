package br.com.taskmanager.domain.exceptions;

import java.util.UUID;

/**
 * [DOMÍNIO] - Exceção de Domínio.
 * Usada para indicar que uma Task com o ID fornecido não foi encontrada.
 */
public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(UUID id) {
        super("Task com ID " + id + " não encontrada.");
    }
}
