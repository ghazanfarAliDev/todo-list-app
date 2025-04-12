import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: Todo[]; // List of all to-do lists
  loading: boolean; // UI loading state
  error: string | null; // Error message if API fails
}

// Load todos from localStorage (used as fallback)
const getStoredTodos = (): Todo[] => {
  const stored = localStorage.getItem('todos');
  return stored ? JSON.parse(stored) : [];
};

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,

  // Start loading todos
  on(TodoActions.loadTodos, (state) => ({ ...state, loading: true })),

  // Successfully loaded todos from API
  on(TodoActions.loadTodosSuccess, (state, { todos }) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    return {
      ...state,
      loading: false,
      todos,
      error: null,
    };
  }),

  // Fallback: load todos from localStorage if API fails
  on(TodoActions.loadTodosFailure, (state, { error }) => {
    const fallback = getStoredTodos();
    return {
      ...state,
      loading: false,
      error,
      todos: fallback,
    };
  }),

  // Successfully added a new to-do list
  on(TodoActions.addTodoSuccess, (state, { todo }) => {
    const updated = [...state.todos, todo];
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  // Successfully loaded tasks for a specific list
  on(TodoActions.loadTasksSuccess, (state, { listId, tasks }) => {
    const updated = state.todos.map((todo) => (todo.id === listId ? { ...todo, tasks } : todo));
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  // Successfully added a task to a list
  on(TodoActions.addTaskSuccess, (state, { listId, task }) => {
    const updated = state.todos.map((todo) =>
      todo.id === listId ? { ...todo, tasks: [...(todo.tasks || []), task] } : todo
    );
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  }),

  // Successfully updated a task's completion status
  on(TodoActions.updateTaskSuccess, (state, { listId, task }) => {
    const updated = state.todos.map((todo) => {
      if (todo.id === listId) {
        const tasks = (todo.tasks ?? []).map((t) => (t.id === task.id ? task : t));
        return { ...todo, tasks };
      }
      return todo;
    });
    localStorage.setItem('todos', JSON.stringify(updated));
    return { ...state, todos: updated };
  })
);
