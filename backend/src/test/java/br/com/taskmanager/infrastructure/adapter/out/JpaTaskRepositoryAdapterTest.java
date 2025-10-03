package br.com.taskmanager.infrastructure.adapter.out;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.infrastructure.entities.TaskEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JpaTaskRepositoryAdapterTest {

    @Mock
    private TaskJpaRepository jpaRepository;

    private JpaTaskRepositoryAdapter repository;

    @BeforeEach
    void setUp() {
        repository = new JpaTaskRepositoryAdapter(jpaRepository);
    }

    @Test
    public void saveAndFindAll_shouldWork() {
        Task task = new Task();
        task.setId(UUID.randomUUID());
        task.setTitle("Test Task");
        task.setDescription("Description");
        task.setStatus("pendente");
        task.setCreatedAt(LocalDateTime.now());

        // Mock save to return a persisted entity
        when(jpaRepository.save(any(TaskEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Mock findAll to return the saved entity
        List<TaskEntity> entities = new ArrayList<>();
        entities.add(TaskEntity.fromDomain(task));
        when(jpaRepository.findAll()).thenReturn(entities);

        Task saved = repository.save(task);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Test Task");

        List<Task> allTasks = repository.findAll();

        assertThat(allTasks).isNotEmpty();
        assertThat(allTasks.get(0).getTitle()).isEqualTo("Test Task");

        // Verify interactions
        verify(jpaRepository, times(1)).save(any(TaskEntity.class));
        verify(jpaRepository, times(1)).findAll();
    }

    @Test
    public void findById_shouldReturnTask() {
        UUID id = UUID.randomUUID();
        Task task = new Task(id, "Find Task", "Desc", "pendente", LocalDateTime.now());
        when(jpaRepository.findById(id)).thenReturn(Optional.of(TaskEntity.fromDomain(task)));

        var found = repository.findById(id);

        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Find Task");
        verify(jpaRepository, times(1)).findById(id);
    }

    @Test
    public void deleteById_shouldRemoveTask() {
        UUID id = UUID.randomUUID();

        // No need to mock deleteById (void) but verify it was called
        repository.deleteById(id);
        verify(jpaRepository, times(1)).deleteById(id);
    }
}
