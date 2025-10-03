package br.com.taskmanager.application.service;

import br.com.taskmanager.application.service.LoadTasksUseCaseImpl;
import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LoadTasksUseCaseImplTest {

    @Test
    void deveRetornarTodasAsTasks() {
        TaskRepository repository = Mockito.mock(TaskRepository.class);
        LoadTasksUseCaseImpl useCase = new LoadTasksUseCaseImpl(repository);
        List<Task> tasks = List.of(new Task(), new Task());

        Mockito.when(repository.findAll()).thenReturn(tasks);

        List<Task> result = useCase.loadAllTasks();

        assertEquals(2, result.size());
        Mockito.verify(repository).findAll();
    }
}
