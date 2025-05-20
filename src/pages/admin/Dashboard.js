import {
  Receipt as OrdersIcon,
  ShoppingCart as ProductsIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/authSlice';
import { fetchOrders } from '../../store/slices/orderSlice';
import { fetchProducts } from '../../store/slices/productSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = {
    totalProducts: products.length,
    totalUsers: users.length,
    totalOrders: orders.length,
  };

  const recentOrders = orders.slice(0, 3).map(order => ({
    id: order.id,
    customer: order.customer,
    amount: order.total,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString(),
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<ProductsIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UsersIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<OrdersIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <List>
          {recentOrders.map((order, index) => (
            <React.Fragment key={order.id}>
              <ListItem>
                <ListItemText
                  primary={`Order #${order.id} - ${order.customer}`}
                  secondary={`Date: ${order.date} | Amount: $${order.amount.toFixed(2)} | Status: ${order.status}`}
                />
              </ListItem>
              {index < recentOrders.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminDashboard; 