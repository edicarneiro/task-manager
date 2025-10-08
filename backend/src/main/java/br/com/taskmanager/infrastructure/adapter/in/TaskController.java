package br.com.taskmanager.infrastructure.adapter.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.exceptions.TaskNotFoundException;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import br.com.taskmanager.domain.ports.in.DeleteTaskUseCase;
import br.com.taskmanager.domain.ports.in.LoadTasksUseCase;
import br.com.taskmanager.domain.ports.in.MarkTaskAsCompletedUseCase;
import br.com.taskmanager.domain.ports.in.UpdateTaskUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final CreateTaskUseCase createTaskUseCase;
    private final LoadTasksUseCase loadTasksUseCase;
    private final UpdateTaskUseCase updateTaskUseCase;
    private final DeleteTaskUseCase deleteTaskUseCase;
    private final MarkTaskAsCompletedUseCase markTaskAsCompletedUseCase; // Use Case de PATCH injetado

    // Injeção de dependência de todos os Use Cases
    public TaskController(
            CreateTaskUseCase createTaskUseCase,
            LoadTasksUseCase loadTasksUseCase,
            UpdateTaskUseCase updateTaskUseCase,
            DeleteTaskUseCase deleteTaskUseCase,
            MarkTaskAsCompletedUseCase markTaskAsCompletedUseCase) {
        this.createTaskUseCase = createTaskUseCase;
        this.loadTasksUseCase = loadTasksUseCase;
        this.updateTaskUseCase = updateTaskUseCase;
        this.deleteTaskUseCase = deleteTaskUseCase;
        this.markTaskAsCompletedUseCase = markTaskAsCompletedUseCase;
    }

    // [GET] Listar todas as tarefas
    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        List<Task> tasks = loadTasksUseCase.loadAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // [POST] Criar nova tarefa
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = createTaskUseCase.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    // [PUT] Atualizar tarefa (Update completo)
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable UUID id, @RequestBody Task task) {
        task.setId(id); // Garante que o ID do path seja usado
        Task updatedTask = updateTaskUseCase.updateTask(id, task);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    /**
     * [PATCH] Endpoint específico para marcar uma tarefa como concluída.
     * Chama o MarkTaskAsCompletedUseCase do domínio.
     * Exemplo de uso: PATCH /api/tasks/{id}/complete
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable UUID id) {
        Task completedTask = markTaskAsCompletedUseCase.markAsCompleted(id);
        return new ResponseEntity<>(completedTask, HttpStatus.OK);
    }

    // [DELETE] Excluir tarefa
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable UUID id) {
        deleteTaskUseCase.deleteTask(id);
    }

    /**
     * Manipulador global para TaskNotFoundException.
     * Garante que o usuário receba um status HTTP 404 (Not Found)
     * se a tarefa não existir, mantendo a responsabilidade de exceção no domínio.
     */
    @ExceptionHandler(TaskNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleTaskNotFoundException(TaskNotFoundException ex) {
        return ex.getMessage();
    }
}
