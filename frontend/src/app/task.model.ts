export interface Task {
  id?: string;  // ALTERADO: de number para string (UUID do backend)
  title: string;
  description: string;
  status: string;
  createdAt?: string;  // ADICIONADO: para receber o timestamp do backend
}
