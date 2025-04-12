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

  /**
   * Lifecycle hook - initializes the to-do list state from the store.
   * Dispatches loadTodos and auto-loads tasks for each list once.
   */
  ngOnInit(): void {
    const loadedTaskLists = new Set<string>(); // Track which lists we've already loaded tasks for

    this.store.dispatch(TodoActions.loadTodos());

    this.store.select('todos').subscribe((state: TodoState) => {
      this.todos = state.todos;
      this.loading = state.loading;
      this.error = state.error;

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

  /**
   * Adds a new to-do list based on user input.
   * Dispatches addTodo action.
   */
  public addList(): void {
    if (this.newListTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newListTitle }));
      this.newListTitle = '';
    }
  }

  /**
   * Toggles accordion expansion for a list and triggers task load.
   * @param listId - ID of the selected to-do list
   * @param index - Accordion index to track expansion
   */
  public toggleList(listId: string, index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    if (!this.taskInputs[listId]) {
      this.taskInputs[listId] = { title: '', description: '' };
    }
    this.store.dispatch(TodoActions.loadTasks({ listId }));
  }

  /**
   * Toggles the completion state of a task.
   * Dispatches updateTask action if task has an ID.
   * @param listId - ID of the list containing the task
   * @param task - Task object to be updated
   */
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

  /**
   * Adds a new task to the specified list using input values.
   * Dispatches addTask and resets local inputs.
   * @param list - Todo list to which the task is added
   */
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
}
