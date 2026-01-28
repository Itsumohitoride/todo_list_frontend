export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
  listType: 'PERSONAL' | 'SHARED';
  userId: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  date?: string;
  type: 'TODAY' | 'IMPORTANT' | 'FEATURED';
  listId: string;
}

export interface Sharing {
  id: string;
  todoListId: string;
  shareToken: string;
  shareableLink: string;
  createdAt: string;
  sharedUserIds?: string[];
}

export interface Statistics {
  userId: string;
  totalLists: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  calculatedAt: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
  }[];
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  CreatePlaceholder: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type ListsStackParamList = {
  Lists: undefined;
  ListDetail: { listId: string; listName: string };
  CreateList: undefined;
  CreateTask: { listId: string; listName: string };
};
