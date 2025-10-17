import {Component, signal, Input, Output, EventEmitter} from '@angular/core'; // IMPORTANTE: Adicionado Input, Output, EventEmitter
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from '../../models/task.model';

// Componentes da lista
import { TaskCardComponent } from '../task-card/task-card.component'; // Garante que o Card seja usado

// Módulos Material
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent, // Não esqueça do TaskCardComponent!
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {

  @Input({required: true}) tasks: Task[] = [];
  @Input({required: true}) filterStatus = signal<'todos' | 'pendente' | 'em-andamento' | 'concluida'>('todos');
  @Input({required: true}) searchTerm = signal('');


  @Output() filterChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() completeTask = new EventEmitter<Task>();

  // O único @Output que estava presente (correto para a exclusão)
  @Output() deleteTask = new EventEmitter<string>();

  // Variáveis para o Modal de Exclusão (que você implementou)
  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  openDeleteModal(task: Task): void {
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  confirmDelete(): void {
    if (this.taskToDelete()?.id) {
      this.deleteTask.emit(this.taskToDelete()!.id!);
    }
    this.closeDeleteModal();
  }
}
