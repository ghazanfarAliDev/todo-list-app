import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Todo } from '../../models/todo.model';
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

  constructor(private store: Store<{ todos: TodoState }>) {}

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
    this.store.select('todos').subscribe((state: TodoState) => {
      this.todos = state.todos;
      this.loading = state.loading;
      this.error = state.error;
    });
  }

  public addList(): void {
    if (this.newListTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.newListTitle }));
      this.newListTitle = '';
    }
  }

  public goToList(): void {
    console.log("Function to Go to details");
  }
}