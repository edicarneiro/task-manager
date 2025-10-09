import { Component, OnInit, signal, computed } from '@angular/core'; // Adicionado 'computed'
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // ALTERADO: tasks agora é um signal
  tasks = signal<Task[]>([]);
  newTask: Partial<Task> = { title: '', description: '', status: 'pendente' };
  editingTask: Task | null = null;
  // ALTERADO: isLoading agora é um signal
  isLoading = signal(true);

  // --- Propriedades do Filtro (NOVO) ---
  filterStatus = signal<'todos' | 'pendente' | 'em-andamento' | 'concluida'>('todos');

  // Propriedade Computada para Filtragem e Ordenação
  // Essa função é executada automaticamente sempre que 'tasks' ou 'filterStatus' mudam.
  filteredTasks = computed(() => {
    const currentTasks = this.tasks();
    const status = this.filterStatus();

    // 1. Filtra as tarefas
    const filtered = status === 'todos'
      ? currentTasks
      : currentTasks.filter(task => task.status === status);

    // 2. Ordena as tarefas: mais recentes primeiro (por createdAt)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return dateB - dateA; // Ordena de forma decrescente (mais recente)
    });
  });

  // --- Propriedades do Modal usando Signals ---
  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  constructor(private taskService: TaskService) {
    console.log('🚀 AppComponent inicializado');
  }

  ngOnInit(): void {
    console.log('🔄 ngOnInit chamado - Carregando tasks...');
    this.loadTasks();
  }

  // --- Propriedades de Binding (Getters/Setters) ---
  // Mantidos para compatibilidade com [(ngModel)] no formulário
  get currentTitle(): string {
    return this.editingTask ? this.editingTask.title : (this.newTask.title || '');
  }
  set currentTitle(value: string) {
    if (this.editingTask) {
      this.editingTask.title = value;
    } else {
      this.newTask.title = value;
    }
  }

  get currentDescription(): string {
    return this.editingTask ? this.editingTask.description : (this.newTask.description || '');
  }
  set currentDescription(value: string) {
    if (this.editingTask) {
      this.editingTask.description = value;
    } else {
      this.newTask.description = value;
    }
  }

  get currentStatus(): string {
    const status = this.editingTask ? this.editingTask.status : (this.newTask.status || 'pendente');
    return status;
  }
  set currentStatus(value: string) {
    if (this.editingTask) {
      this.editingTask.status = value;
    } else {
      this.newTask.status = value;
    }
  }
  // -------------------------------------------------------------------

  // --- CRUD e Lógica de Estado ---
  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe({
      next: (data) => {
        // Define o signal 'tasks', ativando o recálculo de 'filteredTasks'
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title || !this.newTask.description) {
      console.error('❌ Título e Descrição são obrigatórios.');
      return;
    }

    const taskToCreate: Omit<Task, 'id' | 'createdAt'> = {
      title: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status || 'pendente',
    };

    this.taskService.createTask(taskToCreate).subscribe({
      next: () => {
        this.loadTasks();
        this.newTask = { title: '', description: '', status: 'pendente' };
      },
      error: (error) => {
        console.error('❌ Erro ao criar task:', error);
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(): void {
    if (this.editingTask && this.editingTask.id) {
      this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
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
    this.newTask = { title: '', description: '', status: 'pendente' };
  }

  // Marcar tarefa como concluída
  completeTask(task: Task): void {
    const updatedTask = { ...task, status: 'concluida' };

    if (!updatedTask.id) {
      console.error('❌ Erro: ID da tarefa não encontrado para conclusão.');
      return;
    }

    this.taskService.updateTask(updatedTask.id, updatedTask).subscribe({
      next: () => {
        console.log('✅ Task concluída com sucesso:', updatedTask.title);
        this.loadTasks();
      },
      error: (error) => {
        console.error('❌ Erro ao concluir task:', error);
      }
    });
  }

  // --- Lógica do Modal de Exclusão ---
  openDeleteModal(task: Task): void {
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  confirmDeleteTask(): void {
    const task = this.taskToDelete();
    const id = task?.id;

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
}
