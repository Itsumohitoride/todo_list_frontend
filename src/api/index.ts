/**
 * API Module - Centralized API exports
 *
 * This module provides access to all API endpoints for the application.
 * Each API module is organized by domain (auth, lists, tasks, sharing, statistics).
 */

export { default as apiClient } from './client';
export { authApi } from './auth.api';
export { listsApi } from './lists.api';
export { tasksApi } from './tasks.api';
export { sharingApi } from './sharing.api';
export { statisticsApi } from './statistics.api';
