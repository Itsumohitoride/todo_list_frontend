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
  taskType: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  listId: string;
}

export interface Sharing {
  id: string;
  listId: string;
  shareToken: string;
  qrCodeUrl: string;
  shareableLink: string;
  createdAt: string;
}

export interface Statistics {
  userId: string;
  totalLists: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
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
  Progress: undefined;
  Profile: undefined;
};

export type ListsStackParamList = {
  Lists: undefined;
  ListDetail: { listId: string; listName: string };
  CreateList: undefined;
  CreateTask: { listId: string; listName: string };
};
