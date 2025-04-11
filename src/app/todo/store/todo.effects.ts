import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private todoService: TodoService) {}

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
        this.todoService.addTodo(action.title).pipe(
          map(todo => TodoActions.addTodoSuccess({ todo })),
          catchError(error => of(TodoActions.addTodoFailure({ error })))
        )
      )
    )
  );

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTasks),
      mergeMap(action =>
        this.todoService.getTasks(action.listId).pipe(
          map(tasks => TodoActions.loadTasksSuccess({ listId: action.listId, tasks })),
          catchError(error => of(TodoActions.loadTasksFailure({ error })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTask),
      mergeMap(action =>
        this.todoService.updateTaskCompletion(action.listId, action.taskId, action.completed).pipe(
          map(task => TodoActions.updateTaskSuccess({ listId: action.listId, task })),
          catchError(error => of(TodoActions.updateTaskFailure({ error })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTask),
      mergeMap(action =>
        this.todoService.addTask(action.listId, { title: action.title, description: action.description }).pipe(
          map(task => TodoActions.addTaskSuccess({ listId: action.listId, task })),
          catchError(error => of(TodoActions.addTaskFailure({ error })))
        )
      )
    )
  );
}