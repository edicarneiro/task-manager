package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.exceptions.TaskNotFoundException;
import java.util.UUID;

/**
 * [DOMÍNIO] - Porta de Entrada (In Port) para a funcionalidade de marcar uma tarefa como concluída.
 * Define o contrato para a camada de aplicação.
 */
public interface MarkTaskAsCompletedUseCase {
    /**
     * Marca uma tarefa específica como concluída.
     * @param id O UUID da Task a ser marcada.
     * @return A Task atualizada.
     * @throws TaskNotFoundException Se a Task não for encontrada.
     */
    Task markAsCompleted(UUID id);
}
