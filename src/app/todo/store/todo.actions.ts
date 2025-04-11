import { createAction, props } from '@ngrx/store';
import { Todo, Task } from '../models/todo.model';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: any }>());

export const addTodo = createAction('[Todo] Add Todo', props<{ title: string }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<{ error: any }>());

export const loadTasks = createAction('[Task] Load Tasks', props<{ listId: string }>());
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ listId: string; tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: any }>());

export const updateTask = createAction('[Task] Update Task', props<{ listId: string; taskId: string; completed: boolean }>());
export const updateTaskSuccess = createAction('[Task] Update Task Success', props<{ listId: string; task: Task }>());
export const updateTaskFailure = createAction('[Task] Update Task Failure', props<{ error: any }>());

export const addTask = createAction('[Task] Add Task', props<{ listId: string; title: string; description: string }>());
export const addTaskSuccess = createAction('[Task] Add Task Success', props<{ listId: string; task: Task }>());
export const addTaskFailure = createAction('[Task] Add Task Failure', props<{ error: any }>());

