package br.com.taskmanager.infrastructure.adapter.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import br.com.taskmanager.domain.ports.in.LoadTasksUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(value = TaskController.class, excludeAutoConfiguration = {
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
        org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class,
        org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CreateTaskUseCase createTaskUseCase;

    @MockBean
    private LoadTasksUseCase loadTasksUseCase;

    @MockBean
    private TaskRepository taskRepository;

    @Test
    void whenPostTask_thenCreated() throws Exception {
        var taskJson = "{\"title\":\"Nova tarefa\",\"description\":\"Descrição\"}";

        Task task = new Task();
        task.setId(java.util.UUID.randomUUID());
        task.setTitle("Nova tarefa");
        task.setDescription("Descrição");
        task.setStatus("pendente");
        task.setCreatedAt(java.time.LocalDateTime.now());

        when(createTaskUseCase.createTask(any())).thenReturn(task);

        mockMvc.perform(post("/api/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(taskJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Nova tarefa"));
    }
}
