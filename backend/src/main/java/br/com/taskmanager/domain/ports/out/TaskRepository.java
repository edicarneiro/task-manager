package br.com.taskmanager.domain.ports.out;

import br.com.taskmanager.domain.Task;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * [DOMÍNIO] - Porta de Saída (Out Port) - Repositório de Tarefas.
 * Define o contrato para operações de persistência.
 * O adaptador JPA na infraestrutura irá implementar esta interface.
 */
public interface TaskRepository {

    Task save(Task task);
    List<Task> findAll();
    Optional<Task> findById(UUID id);
    void deleteById(UUID id);
}