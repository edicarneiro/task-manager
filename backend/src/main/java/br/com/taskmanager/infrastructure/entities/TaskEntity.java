package br.com.taskmanager.infrastructure.entities;

import br.com.taskmanager.domain.Task;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * [INFRAESTRUTURA] - Entidade JPA para mapeamento com o banco de dados.
 * É o objeto que CONHECE as anotações de persistência (@Entity, @Table, @Id).
 */
@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskEntity {

    @Id
    private UUID id;
    private String title;
    private String description;
    private String status; // ALTERADO: de 'boolean completed' para 'String status'
    private LocalDateTime createdAt;

    // Campo legado para compatibilidade com esquemas antigos
    // Mantemos apenas para evitar falha de NOT NULL no banco já existente
    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @PrePersist
    public void prePersist() {
        // Define valores padrão se não fornecidos
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isEmpty()) {
            this.status = "pendente";
        }
        // Garante compatibilidade com coluna legada NOT NULL
        if (this.completed == null) {
            this.completed = Boolean.FALSE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        // Garante compatibilidade também em updates
        if (this.completed == null) {
            this.completed = Boolean.FALSE;
        }
    }

    public static TaskEntity fromDomain(Task task) {
        TaskEntity entity = new TaskEntity();
        entity.setId(task.getId());
        entity.setTitle(task.getTitle());
        entity.setDescription(task.getDescription());
        entity.setStatus(task.getStatus());
        entity.setCreatedAt(task.getCreatedAt());
        // completed permanece null aqui e será definido como false em prePersist/preUpdate
        return entity;
    }

    public Task toDomain() {
        return new Task(
                this.id,
                this.title,
                this.description,
                this.status,
                this.createdAt
        );
    }
}