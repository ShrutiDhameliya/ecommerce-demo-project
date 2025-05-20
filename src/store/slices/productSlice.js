import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productApi } from '../../services/mockApi';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching products...');
      const response = await productApi.getAll();
      console.log('Products response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('Adding new product:', productData);
      const response = await productApi.create(productData);
      console.log('Add product response:', response);
      return response;
    } catch (error) {
      console.error('Error adding product:', error);
      return rejectWithValue(error.message || 'Failed to add product');
    }
  }
);

export const updateProductData = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      console.log('Updating product:', { id, updates });
      const response = await productApi.update(id, updates);
      console.log('Update product response:', response);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProductData = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting product:', id);
      await productApi.delete(id);
      return id;
    } catch (error) {
      console.error('Error deleting product:', error);
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

const initialState = {
  products: [],
  categories: ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports'],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        console.log('Products updated in state:', state.products);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
        console.error('Products fetch failed:', action.payload);
      })
      // Add Product
      .addCase(addNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        console.log('Product added to state:', action.payload);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Product add failed:', action.payload);
      })
      // Update Product
      .addCase(updateProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
          console.log('Product updated in state:', action.payload);
        }
      })
      .addCase(updateProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Product update failed:', action.payload);
      })
      // Delete Product
      .addCase(deleteProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
        console.log('Product deleted from state:', action.payload);
      })
      .addCase(deleteProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Product delete failed:', action.payload);
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer; 