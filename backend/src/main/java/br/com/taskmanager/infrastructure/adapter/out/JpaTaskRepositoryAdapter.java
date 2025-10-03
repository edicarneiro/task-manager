package br.com.taskmanager.infrastructure.adapter.out;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import br.com.taskmanager.infrastructure.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * [INFRAESTRUTURA] - Adaptador que implementa a porta TaskRepository (Domínio) usando JPA.
 */
@Repository
public class JpaTaskRepositoryAdapter implements TaskRepository {

    private final TaskJpaRepository jpaRepository;

    public JpaTaskRepositoryAdapter(TaskJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = TaskEntity.fromDomain(task);
        TaskEntity savedEntity = jpaRepository.save(entity);
        return savedEntity.toDomain();
    }

    @Override
    public List<Task> findAll() {
        return jpaRepository.findAll().stream()
                .map(TaskEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Task> findById(UUID id) {
        return jpaRepository.findById(id).map(TaskEntity::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}