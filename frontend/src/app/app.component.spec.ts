import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {TaskService} from './task/services/task.service';
import {of} from 'rxjs';
import {Task} from './task/models/task.model';
import {CommonModule} from '@angular/common';

// Dados simulados para os testes
const mockTasks: Task[] = [
  { id: '1', title: 'Task 1', description: 'Desc 1', status: 'pendente', createdAt: new Date().toDateString() },
  { id: '2', title: 'Task 2', description: 'Desc 2', status: 'em-andamento', createdAt: new Date().toDateString() },
];

// Mock do TaskService
const mockTaskService = {
  getTasks: jasmine.createSpy('getTasks').and.returnValue(of(mockTasks)),
  createTask: jasmine.createSpy('createTask').and.callFake((task) => {
    return of({ ...task, id: '99', createdAt: new Date() });
  }),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(of(null)),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(null)),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges(); // Chama ngOnInit e loadTasks
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as tarefas no ngOnInit', () => {
    // Verifica se getTasks foi chamado
    expect(taskService.getTasks).toHaveBeenCalled();
    // Verifica se o signal tasks foi atualizado com os dados do mock
    expect(component.tasks()).toEqual(mockTasks);
    // Verifica se o loading foi desativado
    expect(component.isLoading()).toBeFalse();
  });

  describe('CRUD com Updates Otimistas', () => {

    it('deve criar uma tarefa e atualizar o signal tasks localmente', () => {
      const newTaskData = { title: 'New Task', description: 'New Desc', status: 'pendente' };
      const initialTaskCount = component.tasks().length;

      component.createTask(newTaskData as any);

      // Verifica se createTask foi chamado com os dados corretos
      expect(taskService.createTask).toHaveBeenCalledWith(newTaskData);

      // Verifica se o signal tasks foi atualizado com a nova tarefa (tamanho +1)
      expect(component.tasks().length).toBe(initialTaskCount + 1);
      expect(component.tasks().some(t => t.title === 'New Task')).toBeTrue();
    });

    it('deve deletar uma tarefa e atualizar o signal tasks localmente', () => {
      const taskIdToDelete = '1';
      const initialTaskCount = component.tasks().length;

      component.deleteTaskById(taskIdToDelete);

      // Verifica se deleteTask foi chamado com o ID correto
      expect(taskService.deleteTask).toHaveBeenCalledWith(taskIdToDelete);

      // Verifica se o signal tasks foi atualizado (tamanho -1 e a tarefa foi removida)
      expect(component.tasks().length).toBe(initialTaskCount - 1);
      expect(component.tasks().some(t => t.id === taskIdToDelete)).toBeFalse();
    });

    it('deve atualizar uma tarefa e substituir no signal tasks localmente', () => {
      const updatedTask: Task = { ...mockTasks[0], title: 'Updated Task Title', status: 'concluida' };

      component.updateTask(updatedTask);

      // Verifica se updateTask foi chamado com a tarefa atualizada
      expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask.id, updatedTask);

      // Verifica se o signal tasks contém a tarefa atualizada
      const taskInSignal = component.tasks().find(t => t.id === updatedTask.id);
      expect(taskInSignal?.title).toBe('Updated Task Title');
      expect(taskInSignal?.status).toBe('concluida');
    });
  });

  describe('Controle de Modal e Edição', () => {
    it('deve ativar o modo de edição e abrir o modal ao chamar editTask', () => {
      const taskToEdit = mockTasks[1];

      component.editTask(taskToEdit);

      // Verifica se o editingTask foi setado
      expect(component.editingTask()).toEqual(taskToEdit);
      // Verifica se o modal foi aberto
      expect(component.isFormModalOpen()).toBeTrue();
    });

    it('deve fechar o modal e limpar o estado de edição ao chamar closeFormModal', () => {
      component.editTask(mockTasks[0]); // Abre o modal
      expect(component.isFormModalOpen()).toBeTrue();

      component.closeFormModal(); // Fecha

      expect(component.isFormModalOpen()).toBeFalse();
      expect(component.editingTask()).toBeNull();
    });
  });
});
