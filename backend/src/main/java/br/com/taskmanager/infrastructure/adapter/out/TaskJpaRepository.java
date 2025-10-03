package br.com.taskmanager.infrastructure.adapter.out;

import br.com.taskmanager.infrastructure.entities.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface TaskJpaRepository extends JpaRepository<TaskEntity, UUID> {

}
