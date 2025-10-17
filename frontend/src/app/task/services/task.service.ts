import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Task} from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.apiUrl;

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
  completeTask(id: String): Observable<Task>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<Task>(url,{});
  }

  deleteTask(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📡 DELETE:', url);
    return this.http.delete(url);
  }


}
