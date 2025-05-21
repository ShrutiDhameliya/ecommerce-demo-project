import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function OrderConfirmation() {
  const router = useRouter();
  const { userOrders } = useSelector((state) => state.orders);
  const latestOrder = userOrders[userOrders.length - 1];

  useEffect(() => {
    // Redirect to products if no order is found
    if (!latestOrder) {
      router.push('/shop/products');
    }
  }, [latestOrder, router]);

  if (!latestOrder) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Order Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Thank you for your purchase. Your order has been received.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Typography variant="body1">
              Order Number: #{latestOrder.id}
            </Typography>
            <Typography variant="body1">
              Date: {new Date(latestOrder.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              Total: ${latestOrder.total.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography variant="body1">
              {latestOrder.shippingAddress.address}
            </Typography>
            <Typography variant="body1">
              {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.state} {latestOrder.shippingAddress.zipCode}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => router.push('/shop/products')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/user/orders')}
            >
              View Orders
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 