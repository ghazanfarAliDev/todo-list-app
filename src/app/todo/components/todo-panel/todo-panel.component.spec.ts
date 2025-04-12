// todo-panel.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoPanelComponent } from './todo-panel.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Todo } from '../../models/todo.model';
import { By } from '@angular/platform-browser';

describe('TodoPanelComponent', () => {
  let component: TodoPanelComponent;
  let fixture: ComponentFixture<TodoPanelComponent>;

  const mockTodo: Todo = {
    id: 'list1',
    title: 'Groceries',
    tasks: [
      { id: 't1', title: 'Milk', description: '2L milk', completed: false },
      { id: 't2', title: 'Bread', description: 'Whole grain', completed: true },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoPanelComponent],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        CdkAccordionModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoPanelComponent);
    component = fixture.componentInstance;
    component.item = mockTodo;
    component.index = 0;
    component.expandedIndex = 0;
    component.taskInputs = {
      list1: { title: '', description: '' },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the list title', () => {
    const titleEl = fixture.debugElement.query(By.css('.accordion-item-header')).nativeElement;
    expect(titleEl.textContent).toContain('Groceries');
  });

  it('should display all tasks', () => {
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(2);
  });

  it('should emit toggleTask on checkbox click', () => {
    spyOn(component.toggleTask, 'emit');
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    checkbox.triggerEventHandler('change', null);
    expect(component.toggleTask.emit).toHaveBeenCalled();
  });
});
