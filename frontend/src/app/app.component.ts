import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; // TitleCasePipe adicionado
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router'; // FIX 1: Importado para resolver o erro NG8001
import { Task } from './task.model';
import { TaskService } from './task.service';

// Interface para o estado de confirmação de exclusão (substituindo confirm())
interface DeletionConfirmation {
  show: boolean;
  taskId: string | null;
  taskTitle: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet, // FIX 1: Adicionado RouterOutlet
    TitleCasePipe // Adicionado TitleCasePipe para formatar o status na view
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  // FIX 2: Alterado de Partial<Task> para o tipo exato que o service espera.
  // Isso garante que 'title', 'description' e 'status' sejam strings e não opcionais,
  // resolvendo o erro TS2345.
  newTask: Omit<Task, 'id' | 'createdAt'> = { title: '', description: '', status: 'pendente' };
  editingTask: Task | null = null;

  // Variável para mensagens de erro (Substituindo alert())
  errorMessage: string | null = null;

  // Estado para o modal de confirmação de exclusão (Substituindo confirm())
  deletionConfirmation: DeletionConfirmation = {
    show: false,
    taskId: null,
    taskTitle: null,
  };

  constructor(private taskService: TaskService) {
    console.log('🚀 AppComponent inicializado');
  }

  ngOnInit(): void {
    console.log('🔄 ngOnInit chamado - Carregando tasks...');
    this.loadTasks();
  }

  // --- Propriedades de Binding (para manter a lógica de edição/criação) ---
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
  // ------------------------------------------------------------------------

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        console.log('✅ Tasks carregadas com sucesso:', data);
        this.tasks = data;
        this.errorMessage = null; // Limpa a mensagem de erro ao carregar com sucesso
      },
      error: (error) => {
        console.error('❌ Erro ao carregar tasks:', error);
        // Substituído alert()
        this.errorMessage = 'Erro ao carregar tarefas. Verifique o console para detalhes.';
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title || !this.newTask.description) {
      this.errorMessage = 'O título e a descrição são obrigatórios.';
      return;
    }
    this.errorMessage = null;

    // taskData é do tipo correto Omit<Task, 'id' | 'createdAt'>, resolvendo o erro TS2345.
    const taskData: Omit<Task, 'id' | 'createdAt'> = this.newTask;

    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        console.log('✅ Task criada com sucesso:', response);
        this.loadTasks();
        // Resetar o formulário
        this.newTask = { title: '', description: '', status: 'pendente' };
      },
      error: (error) => {
        console.error('❌ Erro ao criar task:', error);
        // Substituído alert()
        this.errorMessage = 'Erro ao criar tarefa. Verifique o console para detalhes.';
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.errorMessage = null;
  }

  updateTask(): void {
    if (!this.editingTask || !this.editingTask.id) {
      this.errorMessage = 'Nenhuma tarefa selecionada para edição.';
      return;
    }
    this.errorMessage = null;

    console.log('✏️ Atualizando task:', this.editingTask);

    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: () => {
        console.log('✅ Task atualizada com sucesso');
        this.loadTasks();
        this.cancelEdit();
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar task:', error);
        // Substituído alert()
        this.errorMessage = 'Erro ao atualizar tarefa. Verifique o console para detalhes.';
      }
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.errorMessage = null;
  }

  // --- Lógica de Confirmação de Exclusão (Substituindo confirm()) ---

  // Abre o modal de confirmação
  confirmDelete(task: Task): void {
    if (task.id) {
      this.deletionConfirmation = {
        show: true,
        taskId: task.id,
        taskTitle: task.title,
      };
      this.errorMessage = null;
    } else {
      this.errorMessage = 'ID da tarefa não encontrado para exclusão.';
    }
  }

  // Fecha o modal de confirmação
  cancelDelete(): void {
    this.deletionConfirmation = {
      show: false,
      taskId: null,
      taskTitle: null,
    };
  }

  // Executa a exclusão após a confirmação
  executeDelete(): void {
    const idToDelete = this.deletionConfirmation.taskId;
    this.cancelDelete(); // Fecha o modal imediatamente

    if (idToDelete) {
      console.log('🗑️ Deletando task:', idToDelete);

      this.taskService.deleteTask(idToDelete).subscribe({
        next: () => {
          console.log('✅ Task deletada com sucesso');
          this.loadTasks();
        },
        error: (error) => {
          console.error('❌ Erro ao deletar task:', error);
          // Substituído alert()
          this.errorMessage = 'Erro ao deletar tarefa. Verifique o console para detalhes.';
        }
      });
    }
  }
}
