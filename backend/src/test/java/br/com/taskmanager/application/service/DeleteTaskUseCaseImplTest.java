package br.com.taskmanager.application.service;

import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.UUID;

import static org.mockito.Mockito.verify;

class DeleteTaskUseCaseImplTest {

    @Test
    void deveExcluirTaskPorId() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        DeleteTaskUseCaseImpl useCase = new DeleteTaskUseCaseImpl(repository);

        UUID id = UUID.randomUUID();

        useCase.deleteTask(id);

        verify(repository).deleteById(id);
    }
}
