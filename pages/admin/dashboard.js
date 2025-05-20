import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchUsers } from '../../store/slices/userSlice';

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products = [] } = useSelector((state) => state.products);
  const { users = [] } = useSelector((state) => state.users);
  const { orders = [] } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    // Fetch all required data
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [user, router, dispatch]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: stat.color,
                color: 'white',
              }}
            >
              {stat.icon}
              <Typography variant="h6" component="h2" sx={{ mt: 1 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" component="p">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 