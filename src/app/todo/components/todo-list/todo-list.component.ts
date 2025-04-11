import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo, Task } from '../../models/todo.model';
import { TodoState } from '../../store/todo.reducer';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading: boolean = false;
  error: string | null = null;
  newListTitle: string = '';
  expandedIndex: number | null = null;
  taskInputs: { [listId: string]: { title: string; description: string } } = {};

  constructor(private store: Store<{ todos: TodoState }>) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
    this.store.select('todos').subscribe((state: TodoState) => {
      this.todos = state.todos;
      this.loading = state.loading;
      this.error = state.error;

      // ✅ Initialize taskInputs for all todos to avoid undefined
      this.todos.forEach(todo => {
        if (!this.taskInputs[todo.id]) {
          this.taskInputs[todo.id] = { title: '', description: '' };
        }
      });
    });
  }

  public addList(): void {
    if (this.newListTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newListTitle }));
      this.newListTitle = '';
    }
  }

  public toggleList(listId: string, index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    if (!this.taskInputs[listId]) {
      this.taskInputs[listId] = { title: '', description: '' };
    }
    this.store.dispatch(TodoActions.loadTasks({ listId }));
  }

  public toggleTask(listId: string, task: Task): void {
    this.store.dispatch(TodoActions.updateTask({
      listId,
      taskId: task.id,
      completed: !task.completed
    }));
  }

  public addTask(list: Todo): void {
    const input = this.taskInputs[list.id];
    if (input?.title && input?.description) {
      this.store.dispatch(TodoActions.addTask({
        listId: list.id,
        title: input.title,
        description: input.description
      }));
      this.taskInputs[list.id] = { title: '', description: '' };
    }
  }
}