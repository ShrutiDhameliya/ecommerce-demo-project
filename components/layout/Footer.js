import { Box, Container, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function Footer() {
  const router = useRouter();

  return (
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
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} E-Commerce Demo. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link 
            color="inherit" 
            onClick={() => router.push('/about')}
            sx={{ cursor: 'pointer' }}
          >
            About Us
          </Link>
          {' | '}
          <Link 
            color="inherit" 
            onClick={() => router.push('/contact')}
            sx={{ cursor: 'pointer' }}
          >
            Contact
          </Link>
          {' | '}
          <Link 
            color="inherit" 
            onClick={() => router.push('/shop/products')}
            sx={{ cursor: 'pointer' }}
          >
            Shop
          </Link>
          {' | '}
          <Link 
            color="inherit" 
            onClick={() => router.push('/privacy')}
            sx={{ cursor: 'pointer' }}
          >
            Privacy Policy
          </Link>
          {' | '}
          <Link 
            color="inherit" 
            onClick={() => router.push('/terms')}
            sx={{ cursor: 'pointer' }}
          >
            Terms & Conditions
          </Link>
        </Typography>
      </Container>
    </Box>
  );
} 