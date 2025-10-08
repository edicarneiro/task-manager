import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // CRÍTICO: Usando o endereço completo do backend (localhost:8080)
  // para garantir que as chamadas saiam do container frontend e atinjam o backend.
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {
    console.log('🔧 TaskService construído');
    console.log('🔗 API URL configurada:', this.apiUrl);
  }

  getTasks(): Observable<Task[]> {
    console.log('📡 GET:', this.apiUrl);
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    console.log('📡 POST:', this.apiUrl, task);
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Task): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 PUT:', url, task);
    return this.http.put(url, task);
  }

  deleteTask(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 DELETE:', url);
    return this.http.delete(url);
  }
}
