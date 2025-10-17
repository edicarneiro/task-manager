import {Component, computed, OnInit, signal, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from './task/models/task.model';
import {TaskService} from './task/services/task.service';
// Importa o TaskFormData (interface que define o que o formulário retorna)
import {TaskFormComponent, TaskFormData} from './task/components/task-form/task-form.component';
import {TaskListComponent} from './task/components/task-list/task-list.component';
import { NotificationService } from './core/services/notification.service';

// Módulos Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Adicionado para indicar carregamento

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskFormComponent,
    TaskListComponent,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Injeção de Dependência via 'inject' (Angular v17+)
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);
  private notificationService = inject(NotificationService);

  tasks = signal<Task[]>([]);
  filterStatus = signal<'todos' | 'pendente' | 'em-andamento' | 'concluida'>('todos');
  searchTerm = signal('');
  isLoading = signal(true);

  // A propriedade 'editingTask' e o método 'cancelEdit' foram removidos
  // pois o MatDialog gerencia o estado do modal.

  // Lógica de filtro (mantida)
  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const status = this.filterStatus();
    const term = this.searchTerm().toLowerCase();

    return allTasks.filter(task => {
      const matchesStatus = status === 'todos' || task.status === status;
      const matchesTerm = task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  ngOnInit(): void {
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
        console.error('Erro ao carregar tasks:', error);
        this.isLoading.set(false);
        this.notificationService.showError('Não foi possível carregar as tarefas.');
      }
    });
  }

  /**
   * NOVO MÉTODO: Abre o TaskFormComponent como um MatDialog.
   * A tarefa para edição é passada via 'data'.
   */
  openTaskForm(taskToEdit: Task | null = null): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '450px',
      // Passa a tarefa a ser editada/criada para o componente TaskFormComponent
      data: { editingTask: taskToEdit }
    });

    // Assina o evento após o fechamento do dialog.
    // O formulário retorna os dados submetidos.
    dialogRef.afterClosed().subscribe((formData: TaskFormData) => {
      if (formData) {
        this.handleTaskSubmit(formData);
      }
    });
  }

  handleTaskSubmit(formData: TaskFormData): void {
    if (formData.id) {
      this.updateTask(formData);
    } else {
      this.createTask(formData);
    }
  }

  createTask(formData: TaskFormData): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString()
    };

    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // ATUALIZAÇÃO OTIMISTA
        this.tasks.update(currentTasks => [...currentTasks, createdTask]);
        this.notificationService.showSuccess('Tarefa criada com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar task:', error);
        this.notificationService.showError('Erro ao criar a tarefa.');
      }
    });
  }

  updateTask(formData: TaskFormData): void {
    if (!formData.id) return;

    // Converte formData em Task, buscando a data de criação original
    const existingTask = this.tasks().find(t => t.id === formData.id);

    if (!existingTask) {
      this.notificationService.showError('Tarefa não encontrada para atualização.');
      return;
    }

    const taskToUpdate: Task = {
      ...existingTask,
      title: formData.title,
      description: formData.description,
      status: formData.status,
    };

    this.taskService.updateTask(taskToUpdate.id!, taskToUpdate).subscribe({
      next: () => {
        this.tasks.update(currentTasks =>
          currentTasks.map(t => t.id === taskToUpdate.id ? taskToUpdate : t)
        );
        this.notificationService.showSuccess('Tarefa atualizada com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar task:', error);
        this.notificationService.showError('Erro ao atualizar a tarefa.');
      }
    });
  }

  deleteTaskById(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // ATUALIZAÇÃO OTIMISTA: Remove a tarefa localmente
        this.tasks.update(currentTasks => currentTasks.filter(t => t.id !== id));
        this.notificationService.showSuccess('Tarefa deletada com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao deletar task:', error);
        this.notificationService.showError('Erro ao deletar a tarefa.');
      }
    });
  }

  // MÉTODOS DE AÇÃO DO TASK-LIST COMPONENT
  editTask(task: Task): void {
    // Abre o formulário no modo edição, passando a tarefa
    this.openTaskForm(task);
  }

  completeTask(task: Task): void {
    if (task.status === 'concluida') return;
    const completedTask = {...task, status: 'concluida' as const};
    this.updateTask(completedTask);
  }

  updateFilter(status: string): void {
    this.filterStatus.set(status as 'todos' | 'pendente' | 'em-andamento' | 'concluida');
  }

  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }
}
