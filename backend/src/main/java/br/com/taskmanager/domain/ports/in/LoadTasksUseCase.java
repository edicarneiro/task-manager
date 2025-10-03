package br.com.taskmanager.domain.ports.in;

import br.com.taskmanager.domain.Task;
import java.util.List;

/**
 * [DOMÍNIO] - Porta de Entrada (In Port) para a funcionalidade de carregamento de tarefas.
 * Define o contrato para a camada de aplicação.
 */
public interface LoadTasksUseCase {
    List<Task> loadAllTasks();
}