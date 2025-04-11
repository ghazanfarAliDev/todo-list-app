import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, Task } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000'; // Update this if deploying

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/lists`);
  }

  addTodo(title: string): Observable<{ id: string; title: string }> {
    return this.http.post<{ id: string; title: string }>(`${this.apiUrl}/lists`, { title });
  }

  getTasks(listId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/lists/${listId}/tasks`);
  }

  updateTaskCompletion(listId: string, taskId: string, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/lists/${listId}/tasks/${taskId}`, { completed });
  }

  addTask(listId: string, task: { title: string; description: string }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/lists/${listId}/tasks`, task);
  }
}
