import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Task, Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch to-do lists', () => {
    const mockLists: Todo[] = [{ id: '1', title: 'Test List', tasks: [] }];

    service.getTodos().subscribe((lists) => {
      expect(lists).toEqual(mockLists);
    });

    const req = httpMock.expectOne('https://todo-app-backend-9eli.onrender.com/lists');
    expect(req.request.method).toBe('GET');
    req.flush(mockLists);
  });

  it('should add a new to-do list', () => {
    const title = 'New List';

    service.addTodo(title).subscribe((response) => {
      expect(response).toEqual({ id: '123', title });
    });

    const req = httpMock.expectOne('https://todo-app-backend-9eli.onrender.com/lists');
    expect(req.request.method).toBe('POST');
    req.flush({ id: '123', title });
  });
});
