import {
    Box,
    Button,
    Card,
    CardContent,
    CheckCircle,
    Container,
    Typography
} from '@mui/material';
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
            <CheckCircle color="success" sx={{ fontSize: 60 }} />
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