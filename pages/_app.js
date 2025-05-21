import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux'; // <-- Import Redux Provider
import { CartProvider } from '../contexts/CartContext';
import { store } from '../store'; // <-- Import your Redux store
import theme from '../theme';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </CartProvider>
    </SessionProvider>
  );
}
