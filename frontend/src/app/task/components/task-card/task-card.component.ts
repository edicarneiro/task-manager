import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { MatCardModule } from '@angular/material/card'; // Para a estrutura do Card
import { MatButtonModule } from '@angular/material/button'; // Para os botões
import { MatIconModule } from '@angular/material/icon'; // Para os ícones
import { MatTooltipModule } from '@angular/material/tooltip'; // Para as dicas de ferramenta (melhor UX)


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() complete = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
}
