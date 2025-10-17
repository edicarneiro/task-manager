import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Task} from '../../models/task.model';
import {MatButtonModule} from '@angular/material/button'; // Botões Material
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog'; // Para o Dialog
import {MatFormFieldModule} from '@angular/material/form-field'; // Campos Material
import {MatInputModule} from '@angular/material/input'; // Inputs Material
import {MatSelectModule} from '@angular/material/select'; // Select Material

/**
 * Interface para os dados do formulário que serão emitidos.
 */
export interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  status: 'pendente' | 'em-andamento' | 'concluida';
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl:'./task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {

  editingTask: Task | null = null;

  formData: TaskFormData = { title: '', description: '', status: 'pendente' };

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { editingTask: Task | null }
  ) {
    this.editingTask = data?.editingTask || null;
  }

  ngOnInit(): void {
    this.updateFormData(this.editingTask);
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
      // NOVO: Não submete se o formulário for inválido
      return;
    }
    // NOVO: Emite os dados para o componente pai e fecha o modal
    this.dialogRef.close(this.formData);
  }

  cancelEdit(): void {
    // NOVO: Apenas fecha o modal (retorna 'undefined' para o pai, que ignora a submissão)
    this.dialogRef.close();
  }
}
