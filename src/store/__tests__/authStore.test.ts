import { useAuthStore } from '../authStore';
import { authApi } from '../../api/auth.api';

// Mock the API
jest.mock('../../api/auth.api');

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        userId: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'johndoe',
        role: 'USER' as const,
        type: 'Bearer',
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

      const { login } = useAuthStore.getState();
      await login('test@example.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toMatchObject({
        userId: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'johndoe',
        role: 'USER',
      });
      expect(state.token).toBe('test-token');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle login error', async () => {
      (authApi.login as jest.Mock).mockRejectedValue('Invalid credentials');

      const { login } = useAuthStore.getState();

      await expect(login('test@example.com', 'wrong')).rejects.toBe('Invalid credentials');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        userId: '123',
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        nickname: 'janesmith',
        role: 'USER' as const,
        type: 'Bearer',
      };

      (authApi.register as jest.Mock).mockResolvedValue(mockResponse);

      const { register } = useAuthStore.getState();
      await register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        nickname: 'janesmith',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('new@example.com');
      expect(state.error).toBeNull();
    });

    it('should handle register error', async () => {
      (authApi.register as jest.Mock).mockRejectedValue('Email already exists');

      const { register } = useAuthStore.getState();

      await expect(
        register({
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Smith',
          nickname: 'janesmith',
        })
      ).rejects.toBe('Email already exists');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Email already exists');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: {
          userId: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          nickname: 'johndoe',
          role: 'USER',
        },
        token: 'test-token',
        isAuthenticated: true,
      });

      (authApi.logout as jest.Mock).mockResolvedValue(undefined);

      const { logout } = useAuthStore.getState();
      await logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      useAuthStore.setState({ error: 'Some error' });

      const { clearError } = useAuthStore.getState();
      clearError();

      const state = useAuthStore.getState();
      expect(state.error).toBeNull();
    });
  });
});
