import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
);

export const addNewUser = createAsyncThunk(
  'users/addNewUser',
  async (userData) => {
    const response = await axios.post('/api/users', userData);
    return response.data;
  }
);

export const updateUserData = createAsyncThunk(
  'users/updateUserData',
  async (userData) => {
    const response = await axios.put(`/api/users/${userData.id}`, userData);
    return response.data;
  }
);

export const toggleUserBlock = createAsyncThunk(
  'users/toggleUserBlock',
  async (userId) => {
    const response = await axios.put(`/api/users/${userId}/toggle-block`);
    return response.data;
  }
);

export const deleteUserData = createAsyncThunk(
  'users/deleteUserData',
  async (userId) => {
    await axios.delete(`/api/users/${userId}`);
    return userId;
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add User
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update User
      .addCase(updateUserData.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Toggle Block
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteUserData.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 