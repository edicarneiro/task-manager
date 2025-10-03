package br.com.taskmanager.infrastructure.adapter.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.infrastructure.TaskManagerApplication;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(
        classes = TaskManagerApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
        }
)
@ActiveProfiles("test")
public class TaskControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @MockBean
    private TaskRepository taskRepository;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/tasks";
    }

    @Test
    public void createTask_andGetTask() {
        Task task = new Task();
        task.setTitle("Integration Test Task");
        task.setDescription("Testing create and get");
        task.setStatus("pendente");
        task.setCreatedAt(LocalDateTime.now());

        // Stub repository save to assign an ID
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task t = invocation.getArgument(0);
            if (t.getId() == null) {
                t.setId(UUID.randomUUID());
            }
            if (t.getCreatedAt() == null) {
                t.setCreatedAt(LocalDateTime.now());
            }
            return t;
        });

        // Create task
        ResponseEntity<Task> createResponse = restTemplate.postForEntity(getBaseUrl(), task, Task.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Task createdTask = createResponse.getBody();
        assertThat(createdTask).isNotNull();
        assertThat(createdTask.getId()).isNotNull();

        // Stub repository findById to return the created task
        when(taskRepository.findById(createdTask.getId())).thenReturn(Optional.of(createdTask));

        // Get the task back
        ResponseEntity<Task> getResponse = restTemplate.getForEntity(getBaseUrl() + "/" + createdTask.getId(), Task.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task retrievedTask = getResponse.getBody();
        assertThat(retrievedTask).isNotNull();
        assertThat(retrievedTask.getId()).isEqualTo(createdTask.getId());
    }
}
