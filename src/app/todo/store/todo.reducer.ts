import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const getStoredTodos = (): Todo[] => {
  const stored = localStorage.getItem('todos');
  return stored ? JSON.parse(stored) : [];
};

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialState,

  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),

  on(TodoActions.loadTodosSuccess, (state, { todos }) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    return {
      ...state,
      loading: false,
      todos,
      error: null
    };
  }),

  on(TodoActions.loadTodosFailure, (state, { error }) => {
    const fallback = getStoredTodos();
    return {
      ...state,
      loading: false,
      error,
      todos: fallback
    };
  }),

  on(TodoActions.addTodoSuccess, (state, { todo }) => {
    const updated = [...state.todos, todo];
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  on(TodoActions.loadTasksSuccess, (state, { listId, tasks }) => {
    const updated = state.todos.map(todo =>
      todo.id === listId ? { ...todo, tasks } : todo
    );
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  on(TodoActions.addTaskSuccess, (state, { listId, task }) => {
    const updated = state.todos.map(todo =>
      todo.id === listId ? { ...todo, tasks: [...(todo.tasks || []), task] } : todo
    );
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  on(TodoActions.updateTaskSuccess, (state, { listId, task }) => {
    const updated = state.todos.map(todo => {
      if (todo.id === listId) {
        const tasks = (todo.tasks ?? []).map(t => (t.id === task.id ? task : t));
        return { ...todo, tasks };
      }
      return todo;
    });
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  })
);
