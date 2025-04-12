export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  taskCount?: number;
  completedTasks?: number;
  tasks?: Task[];
  newTaskTitle?: string;
  newTaskDescription?: string;
}
