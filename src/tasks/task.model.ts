export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
