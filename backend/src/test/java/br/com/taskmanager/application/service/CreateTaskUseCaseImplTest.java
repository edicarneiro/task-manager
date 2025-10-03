package br.com.taskmanager.application.service;

import br.com.taskmanager.application.service.CreateTaskUseCaseImpl;
import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;

class CreateTaskUseCaseImplTest {

    @Test
    void deveCriarTaskComCamposPadrao() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        CreateTaskUseCaseImpl useCase = new CreateTaskUseCaseImpl(repository);
        Task input = new Task();

        Task expected = new Task();
        expected.setId(UUID.randomUUID());
        expected.setStatus("pendente");
        expected.setCreatedAt(LocalDateTime.now());

        Mockito.when(repository.save(Mockito.any())).thenReturn(expected);

        Task result = useCase.createTask(input);

        assertNotNull(result.getId());
        assertEquals("pendente", result.getStatus());
        assertNotNull(result.getCreatedAt());
        Mockito.verify(repository).save(Mockito.any());
    }

    @Test
    void deveManterCamposPreenchidos() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        CreateTaskUseCaseImpl useCase = new CreateTaskUseCaseImpl(repository);

        Task input = new Task();
        input.setId(UUID.randomUUID());
        input.setStatus("em progresso");
        input.setCreatedAt(LocalDateTime.of(2020, 1, 1, 0, 0));

        Mockito.when(repository.save(input)).thenReturn(input);

        Task result = useCase.createTask(input);

        assertEquals(input.getId(), result.getId());
        assertEquals("em progresso", result.getStatus());
        assertEquals(input.getCreatedAt(), result.getCreatedAt());
        Mockito.verify(repository).save(input);
    }
}
