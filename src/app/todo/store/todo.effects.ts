import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ error })))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(action =>
        this.todoService.addTodo(action.todo).pipe(
          map(todo => TodoActions.addTodoSuccess({ todo })),
          catchError(error => of(TodoActions.addTodoFailure({ error })))
        )
      )
    )
  );
}
