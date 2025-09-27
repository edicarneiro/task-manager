package br.com.taskmanager.infrascture.adapter.in;

import br.com.taskmanager.domain.Task;
import br.com.taskmanager.domain.ports.in.CreateTaskUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final CreateTaskUseCase createTaskUseCase;

    public TaskController(CreateTaskUseCase createTaskUseCase) {
        this.createTaskUseCase = createTaskUseCase;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = createTaskUseCase.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }
}