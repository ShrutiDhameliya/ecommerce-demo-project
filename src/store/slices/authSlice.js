import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userApi } from '../../services/mockApi';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async () => {
    return await userApi.getAll();
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const users = await userApi.getAll();
    const user = users.find(u => u.email === email && u.password === password && !u.blocked);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    const users = await userApi.getAll();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists.');
    }
    return await userApi.create({
      name,
      email,
      password,
      role: 'customer',
      blocked: false,
    });
  }
);

export const addNewUser = createAsyncThunk(
  'auth/addUser',
  async ({ name, email, password, role }) => {
    const users = await userApi.getAll();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists.');
    }
    return await userApi.create({
      name,
      email,
      password,
      role,
      blocked: false,
    });
  }
);

export const updateUserData = createAsyncThunk(
  'auth/updateUser',
  async ({ id, ...updates }) => {
    return await userApi.update(id, updates);
  }
);

export const toggleUserBlock = createAsyncThunk(
  'auth/toggleBlockUser',
  async (id) => {
    return await userApi.toggleBlock(id);
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  role: null,
  users: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUsers: (state, action) => {
      state.users = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.users = [];
      })
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = 'mock-jwt-token';
        state.isAuthenticated = true;
        state.role = action.payload.role;
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Add User
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Update User
      .addCase(updateUserData.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.user?.id === action.payload.id) {
          state.user = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Toggle Block User
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserBlock.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { logout, setUsers } = authSlice.actions;

export default authSlice.reducer; 