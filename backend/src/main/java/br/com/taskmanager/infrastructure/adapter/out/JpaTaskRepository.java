package br.com.taskmanager.infrastructure.adapter.out;

import br.com.taskmanager.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaTaskRepository extends JpaRepository<Task, UUID> {
}