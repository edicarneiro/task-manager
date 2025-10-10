import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from '../../models/task.model';
import {TaskCardComponent} from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];
  @Input({ required: true }) filterStatus = signal<'todos' | 'pendente' | 'em-andamento' | 'concluida'>('todos');
  @Input({ required: true }) searchTerm = signal('');

  @Output() filterChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() completeTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

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
    const idToDelete = this.taskToDelete()?.id;
    if (idToDelete) {
      this.deleteTask.emit(idToDelete);
    }
    this.closeDeleteModal();
  }
}
