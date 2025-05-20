import {
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
  Receipt as OrdersIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items = [] } = useSelector((state) => state.cart || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleCartClick = () => {
    console.log('Cart icon clicked');
    if (location.pathname !== '/shop/cart') {
      navigate('/shop/cart', { replace: true });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/shop')}
          >
            E-Commerce Shop
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleCartClick}
              sx={{ position: 'relative' }}
            >
              <Badge badgeContent={items.length} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/shop/orders')}
            >
              <OrdersIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/shop/profile')}
            >
              <PersonIcon />
            </IconButton>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SmartStore. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout; 