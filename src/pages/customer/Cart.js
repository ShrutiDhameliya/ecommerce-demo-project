import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../services/mockApi';
import { clearCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { addOrder } from '../../store/slices/orderSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [], total = 0 } = useSelector((state) => state.cart || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (isAuthenticated === false) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Check if user is logged in
    if (!isAuthenticated || !user) {
      alert('Please log in to place an order');
      navigate('/auth/login');
      return;
    }

    try {
      // Create a new order with user information
      const newOrder = {
        userId: user.id,
        customer: user.name,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image
        })),
        total: parseFloat(total.toFixed(2)),
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      // Create order in the backend
      const createdOrder = await orderApi.create(newOrder);
      
      // Update Redux store
      dispatch(addOrder(createdOrder));
      
      // Clear cart using the action creator
      dispatch(clearCart());
      
      // Show success message
      alert('Order placed successfully!');
      
      // Navigate to orders page
      navigate('/shop/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.status === 404) {
        alert('Server error: Order endpoint not found. Please try again later.');
      } else {
        alert('Failed to place order. Please try again.');
      }
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === undefined) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Only show login message if we're sure user is not authenticated
  if (isAuthenticated === false) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Please log in to view your cart
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/auth/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/shop')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16 }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                      type="number"
                      size="small"
                      sx={{ width: 60, mx: 1 }}
                      inputProps={{ min: 1, style: { textAlign: 'center' } }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Total: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart; 