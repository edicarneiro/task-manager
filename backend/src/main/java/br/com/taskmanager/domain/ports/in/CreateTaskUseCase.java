package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;

/**
 * Porta de Entrada (In Port) para a funcionalidade de criação de tarefas.
 * Define o contrato para a camada de aplicação.
 */
public interface CreateTaskUseCase {
    Task createTask(Task task);
}
