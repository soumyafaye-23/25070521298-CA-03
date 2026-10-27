import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Lumière — Indian cuisine, with a little more soul',
  description: 'A thoughtful take on the flavours we grew up with. Discover the Lumière menu, reserve a table, and make an evening of it.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}