package br.com.taskmanager.infrastructure.adapter.out;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepositoryPort;
import br.com.taskmanager.infrastructure.adapter.out.JpaTaskRepository;
import org.springframework.stereotype.Component;

@Component
public class JpaTaskRepositoryAdapter implements TaskRepositoryPort {

    private final JpaTaskRepository jpaTaskRepository;

    public JpaTaskRepositoryAdapter(JpaTaskRepository jpaTaskRepository) {
        this.jpaTaskRepository = jpaTaskRepository;
    }

    @Override
    public Task save(Task task) {
        return jpaTaskRepository.save(task);
    }
}