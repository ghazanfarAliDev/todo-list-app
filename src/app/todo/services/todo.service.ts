import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, Task } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000'; // Base URL for backend API

  constructor(private http: HttpClient) {}

  /**
   * Fetch all to-do lists from the backend
   * @returns Observable of Todo[]
   */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/lists`);
  }

  /**
   * Add a new to-do list by title
   * @param title - the title of the new list
   * @returns Observable with the created list's id and title
   */
  addTodo(title: string): Observable<{ id: string; title: string }> {
    return this.http.post<{ id: string; title: string }>(`${this.apiUrl}/lists`, { title });
  }

  /**
   * Get all tasks in a specific to-do list
   * @param listId - the ID of the list
   * @returns Observable of Task[]
   */
  getTasks(listId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/lists/${listId}/tasks`);
  }

  /**
   * Update the completion status of a task
   * @param listId - the list containing the task
   * @param taskId - the task's ID
   * @param completed - the new completed state
   * @returns Observable of the updated Task
   */
  updateTaskCompletion(listId: string, taskId: string, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/lists/${listId}/tasks/${taskId}`, { completed });
  }

  /**
   * Add a new task to a given to-do list
   * @param listId - the list ID
   * @param task - an object with task title and description
   * @returns Observable of the created Task
   */
  addTask(listId: string, task: { title: string; description: string }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/lists/${listId}/tasks`, task);
  }
}
