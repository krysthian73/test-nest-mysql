export enum TaskStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export interface TaskFilter {
  status?: TaskStatus;
  userId?: number;
}
