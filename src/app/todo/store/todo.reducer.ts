import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, (state) => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    loading: false,
    todos
  })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TodoActions.addTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo]
  })),
  on(TodoActions.loadTasksSuccess, (state, { listId, tasks }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === listId ? { ...todo, tasks } : todo
    )
  }))
);
