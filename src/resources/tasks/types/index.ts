export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
  InProgress = 'in progress',
}

export interface TaskFilter {
  status?: TaskStatus;
  userId?: number;
}
