package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UpdateTaskUseCaseImplTest {

    @Test
    void deveAtualizarTaskComIdDaUrl() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        UpdateTaskUseCaseImpl useCase = new UpdateTaskUseCaseImpl(repository);

        UUID id = UUID.randomUUID();
        Task toUpdate = new Task();
        toUpdate.setTitle("Titulo");

        Task saved = new Task();
        saved.setId(id);
        saved.setTitle("Titulo");

        when(repository.save(any(Task.class))).thenReturn(saved);

        Task result = useCase.updateTask(id, toUpdate);

        // Captura o argumento passado ao repository.save para garantir que o ID foi setado pelo use case
        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(repository).save(captor.capture());
        Task passed = captor.getValue();
        assertEquals(id, passed.getId());

        assertNotNull(result);
        assertEquals(id, result.getId());
        assertEquals("Titulo", result.getTitle());
    }
}
