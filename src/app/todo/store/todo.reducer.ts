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
  on(TodoActions.addTodo, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo]
  })),
  on(TodoActions.updateTodo, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t =>
      t.id === todo.id ? { ...t, ...todo } : t
    )
  })),
  on(TodoActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  }))
);
