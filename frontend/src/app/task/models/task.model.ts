export type TaskStatus = 'pendente' | 'em-andamento' | 'concluida';
export type FilterStatus = 'todos' | TaskStatus;

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
}
