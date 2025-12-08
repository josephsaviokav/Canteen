import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Ordering App",
  description: "Order delicious food online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <CartProvider>
          <OrderProvider>
            <PaymentProvider>{children}</PaymentProvider>
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
