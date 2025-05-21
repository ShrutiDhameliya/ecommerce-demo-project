import {
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
  Receipt as OrdersIcon,
  Person as ProfileIcon,
  Store as ShopIcon
} from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const menuItems = [
  { text: 'Shop', icon: <ShopIcon />, path: '/shop' },
  { text: 'My Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' }
];

export default function CustomerLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    
    // Sign out from next-auth
    await signOut({ redirect: false });
    
    // Redirect to login page
    router.push('/auth/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SmartStore
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => {
              router.push(item.path);
              setMobileOpen(false);
            }}
            selected={router.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/shop"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            SmartStore
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              component={Link}
              href="/cart"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartCount} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
            
            <Button
              color="inherit"
              component={Link}
              href="/profile"
              sx={{ mr: 1 }}
            >
              Profile
            </Button>
            
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
        {children}
      </Container>
    </Box>
  );
} 