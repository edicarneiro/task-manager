import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

/**
 * Interface para os dados do formulário que serão emitidos.
 */
interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  status: 'pendente' | 'em-andamento' | 'concluida';
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() editingTask: Task | null = null;
  @Output() taskSubmit = new EventEmitter<TaskFormData>();
  @Output() taskCancel = new EventEmitter<void>();

  formData: TaskFormData = { title: '', description: '', status: 'pendente' };

  ngOnInit(): void {
    this.updateFormData(this.editingTask);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTask']) {
      this.updateFormData(this.editingTask);
    }
  }

  private updateFormData(task: Task | null): void {
    if (task) {
      this.formData = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
      };
    } else {
      this.formData = {
        title: '',
        description: '',
        status: 'pendente'
      };
    }
  }

  submitForm(): void {
    if (!this.formData.title || !this.formData.description) {
      console.error('Por favor, preencha o título e a descrição da tarefa.');
      return;
    }
    this.taskSubmit.emit(this.formData);
    if (!this.formData.id) {
      this.clearForm();
    }
  }

  cancelEdit(): void {
    this.taskCancel.emit();
    this.clearForm();
  }

  private clearForm(): void {
    this.formData = { title: '', description: '', status: 'pendente' };
  }
}
