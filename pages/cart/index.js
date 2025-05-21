import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomerLayout from '../../components/layouts/CustomerLayout';

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderForm, setOrderForm] = useState({
    shippingAddress: '',
    phone: '',
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    } else if (session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [session, router]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const handleUpdateQuantity = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, (item.quantity || 1) + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const orderData = {
        userId: session.user.id,
        items: cartItems,
        total: calculateTotal(),
        shippingAddress: orderForm.shippingAddress,
        phone: orderForm.phone,
        paymentMethod: orderForm.paymentMethod,
        status: 'pending'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to place order');

      localStorage.removeItem('cart');
      setCartItems([]);
      router.push('/orders');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Your cart is empty
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/shop')}
                >
                  Continue Shopping
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
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
                        <TableCell align="right">${item.price}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 2 }}>{item.quantity || 1}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
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
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body1">
                      Subtotal: ${calculateTotal().toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Shipping: Free
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Total: ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Shipping Address"
                    value={orderForm.shippingAddress}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, shippingAddress: e.target.value })
                    }
                    margin="normal"
                    required
                    multiline
                    rows={3}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, phone: e.target.value })
                    }
                    margin="normal"
                    required
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePlaceOrder}
                    disabled={!orderForm.shippingAddress || !orderForm.phone}
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </CustomerLayout>
  );
} 