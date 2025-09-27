import { Component, OnInit } from '@angular/core';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', status: 'pendente' };
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  // --- Propriedades de Binding (Para resolver o erro NG5002) ---
  // A propriedade que o ngModel usará para o Title
  get currentTitle(): string {
    return this.editingTask ? this.editingTask.title : this.newTask.title;
  }
  set currentTitle(value: string) {
    if (this.editingTask) {
      this.editingTask.title = value;
    } else {
      this.newTask.title = value;
    }
  }

  // A propriedade que o ngModel usará para a Description
  get currentDescription(): string {
    return this.editingTask ? this.editingTask.description : this.newTask.description;
  }
  set currentDescription(value: string) {
    if (this.editingTask) {
      this.editingTask.description = value;
    } else {
      this.newTask.description = value;
    }
  }

  // A propriedade que o ngModel usará para o Status
  get currentStatus(): string {
    return this.editingTask ? this.editingTask.status : this.newTask.status;
  }
  set currentStatus(value: string) {
    if (this.editingTask) {
      this.editingTask.status = value;
    } else {
      this.newTask.status = value;
    }
  }
  // ----------------------------------------------------------------

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  createTask(): void {
    this.taskService.createTask(this.newTask).subscribe(() => {
      this.loadTasks();
      this.newTask = { title: '', description: '', status: 'pendente' };
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(): void {
    if (this.editingTask && this.editingTask.id) {
      this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe(() => {
        this.loadTasks();
        this.cancelEdit();
      });
    }
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(id: number | undefined): void {
    if (id) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}
