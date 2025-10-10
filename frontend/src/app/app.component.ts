import {Component, computed, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TaskFormComponent} from './task/components/task-form/task-form.component';
import {TaskListComponent} from './task/components/task-list/task-list.component';
import {FilterStatus, Task} from './task/models/task.model';
import {TaskService} from './task/services/task.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskFormComponent,
    TaskListComponent
  ],
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks = signal<Task[]>([]);
  editingTask: Task | null = null;
  isLoading = signal(true);
  filterStatus = signal<FilterStatus>('todos');
  searchTerm = signal('');

  filteredTasks = computed(() => {
    const currentTasks = this.tasks();
    const status = this.filterStatus();
    const term = this.searchTerm().toLowerCase();

    let filtered = currentTasks;

    if (status !== 'todos') {
      filtered = filtered.filter(task => task.status === status);
    }

    if (term.length > 0) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return dateB - dateA;
    });
  });

  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  constructor(private taskService: TaskService) {
    console.log('🚀 AppComponent inicializado');
  }

  ngOnInit(): void {
    console.log('🔄 ngOnInit chamado - Carregando tasks...');
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  handleTaskSubmit(formData: any): void {
    if (formData.id) {
      this.updateTask(formData);
    } else {
      this.createTask(formData);
    }
  }

  createTask(data: any): void {
    const taskToCreate: Omit<Task, 'id' | 'createdAt'> = {
      title: data.title,
      description: data.description,
      status: data.status || 'pendente',
    };

    this.taskService.createTask(taskToCreate).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('❌ Erro ao criar task:', error);
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(data: any): void {
    if (data.id) {
      const taskToUpdate: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
      };

      this.taskService.updateTask(data.id, taskToUpdate).subscribe({
        next: () => {
          this.loadTasks();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar task:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  completeTask(task: Task): void {
    const updatedTask: Task = { ...task, status: 'concluida' };

    if (!updatedTask.id) {
      console.error('❌ Erro: ID da tarefa não encontrado para conclusão.');
      return;
    }

    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('❌ Erro ao concluir task:', error);
      }
    });
  }

  openDeleteModal(id: string): void {
    const task = this.tasks().find(t => t.id === id) || null;
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  confirmDeleteTask(): void {
    const id = this.taskToDelete()?.id;

    if (!id) {
      this.closeDeleteModal();
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('❌ Erro ao deletar task:', error);
        this.closeDeleteModal();
      }
    });
  }

  handleFilterChange(status: string): void {
    this.filterStatus.set(status as FilterStatus);
  }

}
