package br.com.taskmanager.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * [DOMÍNIO] - Entidade de Domínio Pura.
 * Representa o objeto de negócio Task. Não contém anotações de infraestrutura (JPA).
 */
@Getter
@Setter
@NoArgsConstructor // Necessário para deserialização do Spring
@AllArgsConstructor
public class Task {

    private UUID id;
    private String title;
    private String description;
    private String status; // Alterado de 'completed' para 'status'
    private LocalDateTime createdAt;

    // Métodos utilitários podem ser colocados aqui
    public void markAsCompleted() {
        this.status = "concluida";
    }
}
