package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class LoadTaskByIdUseCaseImplTest {

    @Test
    void deveRetornarTaskQuandoExistir() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        LoadTaskByIdUseCaseImpl useCase = new LoadTaskByIdUseCaseImpl(repository);

        UUID id = UUID.randomUUID();
        Task task = new Task();
        task.setId(id);

        Mockito.when(repository.findById(id)).thenReturn(Optional.of(task));

        Optional<Task> result = useCase.loadById(id);

        assertTrue(result.isPresent());
        assertEquals(id, result.get().getId());
        Mockito.verify(repository).findById(id);
    }

    @Test
    void deveRetornarVazioQuandoNaoExistir() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        LoadTaskByIdUseCaseImpl useCase = new LoadTaskByIdUseCaseImpl(repository);

        UUID id = UUID.randomUUID();
        Mockito.when(repository.findById(id)).thenReturn(Optional.empty());

        Optional<Task> result = useCase.loadById(id);

        assertTrue(result.isEmpty());
        Mockito.verify(repository).findById(id);
    }
}
