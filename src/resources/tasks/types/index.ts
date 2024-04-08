export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface TaskFilter {
  status?: TaskStatus;
}
