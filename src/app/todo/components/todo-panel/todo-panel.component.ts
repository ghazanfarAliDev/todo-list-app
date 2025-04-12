import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo, Task } from '../../models/todo.model';

@Component({
  selector: 'app-todo-panel',
  templateUrl: './todo-panel.component.html',
  styleUrls: ['./todo-panel.component.scss'],
})
export class TodoPanelComponent {
  @Input() item!: Todo;
  @Input() index!: number;
  @Input() expandedIndex!: number | null;
  @Input() taskInputs!: Record<string, { title: string; description: string }>;

  @Output() toggleList = new EventEmitter<{ listId: string; index: number }>();
  @Output() toggleTask = new EventEmitter<{ listId: string; task: Task }>();
  @Output() addTask = new EventEmitter<Todo>();

  get isExpanded(): boolean {
    return this.expandedIndex === this.index;
  }

  // Get total number of tasks for a list
  getTaskCount(todo: Todo): number {
    return todo.tasks?.length || 0;
  }

  // Get number of completed tasks for a list
  getCompletedTaskCount(todo: Todo): number {
    return todo.tasks?.filter((task) => task.completed).length || 0;
  }
}
