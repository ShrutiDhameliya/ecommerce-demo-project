import {
    Box,
    Button,
    Card,
    CardContent,
    CheckCircle as CheckCircleIcon,
    Typography
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CustomerLayout from '../../components/layouts/CustomerLayout';

export default function OrderSuccess() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [session, status, router]);

  return (
    <CustomerLayout>
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon
                color="success"
                sx={{ fontSize: 80, mb: 2 }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Thank you for your purchase. Your order has been received and is being processed.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/orders')}
                  sx={{ mr: 2 }}
                >
                  View Orders
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/shop')}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </CustomerLayout>
  );
} 