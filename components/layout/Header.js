import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const handleProfile = () => {
    router.push('/user/profile');
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          E-Commerce Demo
        </Typography>

        {user ? (
          <>
            {user.role === 'admin' ? (
              <Button color="inherit" onClick={() => router.push('/admin/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/shop/products')}>
                  Shop
                </Button>
                <Button color="inherit" onClick={() => router.push('/shop/categories')}>
                  Categories
                </Button>
                <IconButton color="inherit" onClick={() => router.push('/shop/cart')}>
                  <ShoppingCart />
                </IconButton>
              </>
            )}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>My Profile</MenuItem>
              {user.role !== 'admin' && (
                <>
                  <MenuItem onClick={() => router.push('/user/orders')}>My Orders</MenuItem>
                  <MenuItem onClick={() => router.push('/user/wishlist')}>Wishlist</MenuItem>
                </>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => router.push('/auth/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => router.push('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
} 