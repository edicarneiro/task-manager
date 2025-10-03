import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // IMPORTANTE: Para *ngFor, *ngIf
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true, // CRÍTICO: Marca como componente standalone
  imports: [
    CommonModule,    // IMPORTANTE: Necessário para diretivas
    FormsModule      // Para ngModel
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<Task> = { title: '', description: '', status: 'pendente' };
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {
    console.log('🚀 AppComponent inicializado');
    console.log('🔗 TaskService:', this.taskService);
  }

  ngOnInit(): void {
    console.log('🔄 ngOnInit chamado - Carregando tasks...');
    this.loadTasks();
  }

  // --- Propriedades de Binding ---
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
    return this.editingTask ? this.editingTask.status : (this.newTask.status || 'pendente');
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
    console.log('🔍 Chamando getTasks()...');
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log('✅ Tasks carregadas com sucesso:', tasks);
      },
      error: (error) => {
        console.error('❌ Erro ao carregar tasks:');
        console.error('  Status:', error.status);
        console.error('  Message:', error.message);
        console.error('  URL:', error.url);
        console.error('  Error completo:', error);
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title || !this.newTask.description) {
      alert('Preencha todos os campos!');
      return;
    }

    console.log('📝 Criando task:', this.newTask);

    this.taskService.createTask(this.newTask as Omit<Task, 'id' | 'createdAt'>).subscribe({
      next: (createdTask) => {
        console.log('✅ Task criada com sucesso:', createdTask);
        this.loadTasks();
        this.newTask = { title: '', description: '', status: 'pendente' };
      },
      error: (error) => {
        console.error('❌ Erro ao criar task:', error);
        alert('Erro ao criar task. Veja o console para mais detalhes.');
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  updateTask(): void {
    if (this.editingTask && this.editingTask.id) {
      console.log('✏️ Atualizando task:', this.editingTask);

      this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
        next: () => {
          console.log('✅ Task atualizada com sucesso');
          this.loadTasks();
          this.cancelEdit();
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar task:', error);
          alert('Erro ao atualizar task. Veja o console para mais detalhes.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(id: string | undefined): void {
    if (id) {
      if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
      }

      console.log('🗑️ Deletando task:', id);

      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('✅ Task deletada com sucesso');
          this.loadTasks();
        },
        error: (error) => {
          console.error('❌ Erro ao deletar task:', error);
          alert('Erro ao deletar task. Veja o console para mais detalhes.');
        }
      });
    }
  }
}
