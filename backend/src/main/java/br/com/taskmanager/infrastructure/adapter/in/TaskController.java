package br.com.taskmanager.infrastructure.adapter.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import br.com.taskmanager.domain.ports.in.LoadTasksUseCase;
import br.com.taskmanager.domain.ports.out.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final CreateTaskUseCase createTaskUseCase;
    private final LoadTasksUseCase loadTasksUseCase;
    private final TaskRepository taskRepository;

    public TaskController(CreateTaskUseCase createTaskUseCase, 
                         LoadTasksUseCase loadTasksUseCase,
                         TaskRepository taskRepository) {
        this.createTaskUseCase = createTaskUseCase;
        this.loadTasksUseCase = loadTasksUseCase;
        this.taskRepository = taskRepository;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = createTaskUseCase.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasks() {
        List<Task> tasks = loadTasksUseCase.loadAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable UUID id) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        return taskOpt
                .map(task -> new ResponseEntity<>(task, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable UUID id, @RequestBody Task task) {
        task.setId(id); // Garante que o ID seja o da URL
        Task updatedTask = taskRepository.save(task);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}