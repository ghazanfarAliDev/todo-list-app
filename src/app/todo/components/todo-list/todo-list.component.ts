import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo, Task } from '../../models/todo.model';
import { TodoState } from '../../store/todo.reducer';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = []; // All to-do lists from the store
  loading: boolean = false; // Loading flag for UI feedback
  error: string | null = null; // Error handling from store
  newListTitle: string = ''; // Two-way bound input for new list title
  expandedIndex: number | null = null; // Tracks which accordion panel is open
  taskInputs: { [listId: string]: { title: string; description: string } } = {}; // Input cache per list for adding new tasks

  constructor(private store: Store<{ todos: TodoState }>) {}

  ngOnInit(): void {
    const loadedTaskLists = new Set<string>(); // Track which lists we've already loaded tasks for

    // Dispatch initial action to load to-do lists from backend
    this.store.dispatch(TodoActions.loadTodos());

    // Subscribe to store state for todos
    this.store.select('todos').subscribe((state: TodoState) => {
      this.todos = state.todos;
      this.loading = state.loading;
      this.error = state.error;

      // For each list, ensure task input object exists and tasks are loaded once
      this.todos.forEach((todo) => {
        if (!this.taskInputs[todo.id]) {
          this.taskInputs[todo.id] = { title: '', description: '' };
        }

        if (!loadedTaskLists.has(todo.id)) {
          this.store.dispatch(TodoActions.loadTasks({ listId: todo.id }));
          loadedTaskLists.add(todo.id);
        }
      });
    });
  }

  // Add a new to-do list
  public addList(): void {
    if (this.newListTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newListTitle }));
      this.newListTitle = '';
    }
  }

  // Expand/collapse a to-do list and load its tasks
  public toggleList(listId: string, index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    if (!this.taskInputs[listId]) {
      this.taskInputs[listId] = { title: '', description: '' };
    }
    this.store.dispatch(TodoActions.loadTasks({ listId }));
  }

  // Toggle completion state of a task
  public toggleTask(listId: string, task: Task): void {
    if (!task.id) {
      console.warn('Task missing ID. Cannot update.');
      return;
    }
    this.store.dispatch(
      TodoActions.updateTask({
        listId,
        taskId: task.id,
        completed: !task.completed,
      })
    );
  }

  // Add a task to a specific list
  public addTask(list: Todo): void {
    const input = this.taskInputs[list.id];
    if (input?.title && input?.description) {
      this.store.dispatch(
        TodoActions.addTask({
          listId: list.id,
          title: input.title,
          description: input.description,
        })
      );
      this.taskInputs[list.id] = { title: '', description: '' };
    }
  }

  // Get total number of tasks for a list
  public getTaskCount(todo: Todo): number {
    return todo.tasks?.length || 0;
  }

  // Get number of completed tasks for a list
  public getCompletedTaskCount(todo: Todo): number {
    return todo.tasks?.filter((task) => task.completed).length || 0;
  }
}
