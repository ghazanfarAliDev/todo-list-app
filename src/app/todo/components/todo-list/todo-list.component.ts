import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { Store } from '@ngrx/store';
import { TodoState } from '../../store/todo.reducer';
import * as TodoActions from '../../store/todo.actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading: boolean = false;
  error: string | null = null;
  newListTitle: string = '';


  constructor(private store: Store<{ todos: TodoState }>) { }

  ngOnInit(): void {
    this.getTodo();
  }


  private getTodo(): void {
    this.store.dispatch(TodoActions.loadTodos());
    this.store.select('todos').subscribe((state: TodoState) => {
      this.todos = state.todos;
      this.loading = state.loading;
      this.error = state.error;
    });
  }

  public addList(): void {
    console.log('Function to Add list');
  }
  public goToList(): void {
    console.log("Function to Go to details");
  }

}