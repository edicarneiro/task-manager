package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.exceptions.TaskNotFoundException;
import br.com.taskmanager.domain.ports.in.MarkTaskAsCompletedUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * [APLICAÇÃO] - Implementação do caso de uso MarkTaskAsCompletedUseCase.
 * Contém a lógica de negócio: buscar, marcar, e salvar.
 */
@Service
public class MarkTaskAsCompletedService implements MarkTaskAsCompletedUseCase {

    private final TaskRepository taskRepository;

    public MarkTaskAsCompletedService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task markAsCompleted(UUID id) {
        // 1. Busca a Task (Porta de Saída)
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        // 2. Lógica de Domínio: Atualiza o status
        task.setStatus("concluida");

        // 3. Persiste a Task atualizada (Porta de Saída)
        return taskRepository.save(task);
    }
}
