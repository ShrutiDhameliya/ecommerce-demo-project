import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CustomerLayout from '../../components/layouts/CustomerLayout';

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    if (!orderId) {
      router.push('/shop');
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <CustomerLayout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Order Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Thank you for your purchase. Your order has been received and is being processed.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Order ID: {orderId}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/shop')}
                sx={{ mr: 2 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/orders')}
              >
                View Orders
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </CustomerLayout>
  );
} 